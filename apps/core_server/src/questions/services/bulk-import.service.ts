import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import Neode from 'neode';

import { NEO4J_TOKEN, TNeo4jTransaction, TNeo4jRecord } from '../../database';
import {
  IImportExportRequest,
  IDomain,
  IFollowUpQuestion,
} from '../types/import-export.types';
import { DomainService } from './domain.service';
import { TopicService } from './topic.service';
import { ThemeService } from './theme.service';
import { QuestionService } from './question.service';
import { FollowUpQuestionService } from './follow-up-question.service';

interface IImportResult {
  domains: number,
  topics: number,
  themes: number,
  questions: number,
  followUpQuestions: number,
  relationships: number,
}

interface IBulkCreateData {
  domains: Array<{ id: string, title: string }>,
  topics: Array<{ id: string, title: string }>,
  themes: Array<{ id: string, title: string }>,
  questions: Array<{ id: string, title: string, weight: number, tags: string[] }>,
  followUpQuestions: Array<{ id: string, title: string, weight: number, tags: string[] }>,
  relationships: Array<{ fromId: string, toId: string, type: string }>,
}

@Injectable()
export class BulkImportService {
  private readonly logger = new Logger(BulkImportService.name);

  constructor(
    @Inject(NEO4J_TOKEN) private readonly neode: Neode,
    private readonly domainService: DomainService,
    private readonly topicService: TopicService,
    private readonly themeService: ThemeService,
    private readonly questionService: QuestionService,
    private readonly followUpQuestionService: FollowUpQuestionService
  ) {}

  async importDataBulk(data: IImportExportRequest): Promise<IImportResult> {
    const session = this.neode.session();

    try {
      this.logger.log('Starting bulk import transaction');

      const bulkData = this.prepareBulkData(data);

      const results = await session.writeTransaction(async transaction =>
        this.executeBulkCreation(transaction, bulkData)
      );

      this.logger.log('Bulk import completed successfully', results);
      return results;
    } catch (error) {
      this.logger.error('Bulk import failed', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  private prepareBulkData(data: IImportExportRequest): IBulkCreateData {
    const domains: Array<{ id: string, title: string }> = [];
    const topics: Array<{ id: string, title: string }> = [];
    const themes: Array<{ id: string, title: string }> = [];
    const questions: Array<{ id: string, title: string, weight: number, tags: string[] }> = [];
    const followUpQuestions: Array<{ id: string, title: string, weight: number, tags: string[] }> = [];
    const relationships: Array<{ fromId: string, toId: string, type: string }> = [];

    for (const domain of data.domains) {
      console.log('domain', domain);
      const domainId = (domain.id as string) || uuidv4();
      domains.push({ id: domainId, title: domain.title });

      for (const topicData of domain.topics) {
        const topicUuid = uuidv4();
        topics.push({ id: topicUuid, title: topicData.title });
        relationships.push({ fromId: domainId, toId: topicUuid, type: 'HAS_TOPIC' });

        for (const themeData of topicData.themes) {
          const themeUuid = uuidv4();
          themes.push({ id: themeUuid, title: themeData.title });
          relationships.push({ fromId: topicUuid, toId: themeUuid, type: 'HAS_THEME' });

          for (const questionData of themeData.questions) {
            const questionUuid = uuidv4();
            questions.push({
              id: questionUuid,
              title: questionData.title,
              weight: questionData.weight,
              tags: questionData.tags || [],
            });
            relationships.push({ fromId: themeUuid, toId: questionUuid, type: 'HAS_QUESTION' });

            for (const followUpData of questionData.followUpQuestions) {
              const followUpUuid = (followUpData.id as string) || uuidv4();
              followUpQuestions.push({
                id: followUpUuid,
                title: followUpData.title,
                weight: followUpData.weight,
                tags: followUpData.tags || [],
              });
              relationships.push({ fromId: questionUuid, toId: followUpUuid, type: 'HAS_FOLLOWUP' });
            }
          }
        }
      }
    }

    return { domains, topics, themes, questions, followUpQuestions, relationships };
  }

  private async executeBulkCreation(transaction: TNeo4jTransaction, bulkData: IBulkCreateData): Promise<IImportResult> {
    const results: IImportResult = {
      domains: 0,
      topics: 0,
      themes: 0,
      questions: 0,
      followUpQuestions: 0,
      relationships: 0,
    };

    if (bulkData.domains.length > 0) {
      await this.domainService.createDomainsBatch(transaction, bulkData.domains);
      results.domains = bulkData.domains.length;
    }

    if (bulkData.topics.length > 0) {
      await this.topicService.createTopicsBatch(transaction, bulkData.topics);
      results.topics = bulkData.topics.length;
    }

    if (bulkData.themes.length > 0) {
      await this.themeService.createThemesBatch(transaction, bulkData.themes);
      results.themes = bulkData.themes.length;
    }

    if (bulkData.questions.length > 0) {
      await this.questionService.createQuestionsBatch(transaction, bulkData.questions);
      results.questions = bulkData.questions.length;
    }

    if (bulkData.followUpQuestions.length > 0) {
      await this.followUpQuestionService.createFollowUpQuestionsBatch(transaction, bulkData.followUpQuestions);
      results.followUpQuestions = bulkData.followUpQuestions.length;
    }

    if (bulkData.relationships.length > 0) {
      await this.createAllRelationships(transaction, bulkData.relationships);
      results.relationships = bulkData.relationships.length;
    }

    return results;
  }

  private async createAllRelationships(
    transaction: TNeo4jTransaction,
    relationships: Array<{ fromId: string, toId: string, type: string }>
  ): Promise<void> {
    const domainTopicRels = relationships
      .filter(rel => rel.type === 'HAS_TOPIC')
      .map(rel => ({ domainId: rel.fromId, topicId: rel.toId }));

    const topicThemeRels = relationships
      .filter(rel => rel.type === 'HAS_THEME')
      .map(rel => ({ topicId: rel.fromId, themeId: rel.toId }));

    const themeQuestionRels = relationships
      .filter(rel => rel.type === 'HAS_QUESTION')
      .map(rel => ({ themeId: rel.fromId, questionId: rel.toId }));

    const questionFollowUpRels = relationships
      .filter(rel => rel.type === 'HAS_FOLLOWUP')
      .map(rel => ({ questionId: rel.fromId, followUpId: rel.toId }));

    if (domainTopicRels.length > 0) {
      await this.domainService.createDomainTopicRelationships(transaction, domainTopicRels);
    }

    if (topicThemeRels.length > 0) {
      await this.topicService.createTopicThemeRelationships(transaction, topicThemeRels);
    }

    if (themeQuestionRels.length > 0) {
      await this.questionService.createThemeQuestionRelationships(transaction, themeQuestionRels);
    }

    if (questionFollowUpRels.length > 0) {
      await this.followUpQuestionService.createQuestionFollowUpRelationships(transaction, questionFollowUpRels);
    }
  }

  async exportDataBulk(): Promise<IImportExportRequest> {
    const session = this.neode.session();

    try {
      const query = `
        MATCH (d:Domain)-[:HAS_TOPIC]->(t:Topic)-[:HAS_THEME]->(th:Theme)-[:HAS_QUESTION]->(q:Question)
        OPTIONAL MATCH (q)-[:HAS_FOLLOWUP]->(fq:FollowUpQuestion)
        RETURN 
          d.id as domain_id, d.title as domain_title,
          t.id as topic_id, t.title as topic_title,
          th.id as theme_id, th.title as theme_title,
          q.id as question_id, q.title as question_title, q.weight as question_weight, q.tags as question_tags,
          collect(DISTINCT {
            id: fq.id,
            title: fq.title,
            weight: fq.weight,
            tags: fq.tags
          }) as followups
        ORDER BY d.title, t.title, th.title, q.title
      `;

      const result = await session.run(query);
      return this.transformBulkExportData(result.records);
    } catch (error) {
      this.logger.error('Bulk export failed', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  private transformBulkExportData(records: TNeo4jRecord[]): IImportExportRequest {
    const domainsMap = new Map<string, IDomain>();

    records.forEach((record: TNeo4jRecord) => {
      const domainId = record.get('domain_id');
      const domainTitle = record.get('domain_title');
      const topicId = record.get('topic_id');
      const topicTitle = record.get('topic_title');
      const themeId = record.get('theme_id');
      const themeTitle = record.get('theme_title');
      const questionId = record.get('question_id');
      const questionTitle = record.get('question_title');
      const questionWeight = Number(record.get('question_weight')) || 5;
      const questionTags = record.get('question_tags') || [];
      const followups = record.get('followups') || [];

      if (!domainsMap.has(domainId)) {
        domainsMap.set(domainId, {
          id: domainId,
          title: domainTitle,
          topics: [],
        });
      }

      const domain = domainsMap.get(domainId)!;

      let topic = domain.topics.find(t => t.id === topicId);
      if (!topic) {
        topic = {
          id: topicId,
          title: topicTitle,
          themes: [],
        };
        domain.topics.push(topic);
      }

      let theme = topic.themes.find(th => th.id === themeId);
      if (!theme) {
        theme = {
          id: themeId,
          title: themeTitle,
          questions: [],
        };
        topic.themes.push(theme);
      }

      if (questionId) {
        let question = theme.questions.find(q => q.id === questionId);
        if (!question) {
          const followUpQuestions: IFollowUpQuestion[] = followups
            .filter((fq: unknown) => fq && typeof fq === 'object' && fq !== null && 'id' in fq && fq.id)
            .map((fq: unknown) => {
              const followUp = fq as { id: string, title: string, weight: number, tags: string[] };
              return {
                id: followUp.id,
                title: followUp.title,
                weight: Number(followUp.weight) || 5,
                tags: followUp.tags || [],
              };
            });

          question = {
            id: questionId,
            title: questionTitle,
            weight: questionWeight,
            tags: questionTags,
            followUpQuestions,
          };
          theme.questions.push(question);
        }
      }
    });

    return {
      domains: Array.from(domainsMap.values()),
    };
  }
}
