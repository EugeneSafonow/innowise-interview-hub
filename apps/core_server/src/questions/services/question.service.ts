import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../../database/neode.service';
import { NEO4J_TOKEN } from '../../database/neode.provider';
import { EEntities } from '../../database/model';
import { TQuestion } from '../../database/schemas/question.schema';

import { TFollowUpQuestion, TNeo4jRecord, TNeo4jTransaction } from '@/database';

@Injectable()
export class QuestionService extends BaseNeodeService<TQuestion, Partial<TQuestion>, Partial<TQuestion>> {
  protected readonly logger = new Logger(QuestionService.name);

  constructor(@Inject(NEO4J_TOKEN) neode: Neode) {
    super(neode, EEntities.Question);
  }

  async findOneByTitle(title: string): Promise<TQuestion | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('title', title);
      return instance ? (await instance.toJson() as TQuestion) : null;
    } catch (error) {
      throw error;
    }
  }

  async findQuestionById(id: string): Promise<TQuestion> {
    try {
      const question = await this.findOne(id);
      if (!question) {
        throw new NotFoundException('Question not found');
      }
      return question;
    } catch (error) {
      throw error;
    }
  }

  async updateQuestionById(id: string, data: Partial<TQuestion>): Promise<TQuestion> {
    try {
      const question = await this.update(id, data);
      if (!question) {
        throw new NotFoundException('Question not found');
      }
      return question;
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestionById(id: string): Promise<void> {
    try {
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new NotFoundException('Question not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findQuestionsByTags(tags: string[]): Promise<TQuestion[]> {
    try {
      const instances = await this.neode.model(this.modelName).all({ tags });
      const promises = instances.map((node: Neode.Node<TQuestion>) => node.toJson());
      return await Promise.all(promises) as TQuestion[];
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations for questions
  async createQuestionsBatch(
    transaction: TNeo4jTransaction,
    questions: Array<{ id: string, title: string, weight: number, tags: string[] }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $questions AS question
        MERGE (q:Question {title: question.title})
        ON CREATE SET 
          q.id = question.id,
          q.weight = question.weight,
          q.tags = question.tags,
          q.createdAt = datetime(),
          q.updatedAt = datetime()
        ON MATCH SET 
          q.weight = question.weight,
          q.tags = question.tags,
          q.updatedAt = datetime()
      `;

      await transaction.run(query, { questions });
      this.logger.debug(`Created ${questions.length} Question nodes`);
    } catch (error) {
      this.logger.error('Error creating questions batch:', error);
      throw error;
    }
  }

  async createThemeQuestionRelationships(
    transaction: TNeo4jTransaction,
    relationships: Array<{ themeId: string, questionId: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $relationships AS rel
        MATCH (th:Theme {id: rel.themeId})
        MATCH (q:Question {id: rel.questionId})
        MERGE (th)-[:HAS_QUESTION]->(q)
      `;

      await transaction.run(query, { relationships });
      this.logger.debug(`Created ${relationships.length} Theme->Question relationships`);
    } catch (error) {
      this.logger.error('Error creating theme-question relationships:', error);
      throw error;
    }
  }

  async getQuestionsWithFollowUps(): Promise<TQuestion[]> {
    try {
      const query = `
        MATCH (q:Question)
        OPTIONAL MATCH (q)-[:HAS_FOLLOWUP]->(fq:FollowUpQuestion)
        RETURN q, collect(fq) as followUps
        ORDER BY q.title
      `;

      const session = this.neode.session();
      const result = await session.run(query);
      await session.close();

      return result.records.map((record: TNeo4jRecord) => {
        const question = record.get('q').properties;
        const followUps = record.get('followUps').map((fq: { properties: TFollowUpQuestion }) => fq.properties);
        return { ...question, followUps } as TQuestion;
      });
    } catch (error) {
      this.logger.error('Error getting questions with follow-ups:', error);
      throw error;
    }
  }
}
