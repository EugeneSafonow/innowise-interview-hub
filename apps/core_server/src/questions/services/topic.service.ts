import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../../database/neode.service';
import { NEO4J_TOKEN, TNeo4jTransaction } from '../../database';
import { EEntities } from '../../database/model';
import { DomainService } from './domain.service';

import { ITopic } from '@/database';

@Injectable()
export class TopicService extends BaseNeodeService<ITopic, Partial<ITopic>, Partial<ITopic>> {
  constructor(@Inject(NEO4J_TOKEN) neode: Neode, private readonly domainService: DomainService) {
    super(neode, EEntities.Topic);
  }

  async findOneByTitle(title: string): Promise<ITopic | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('title', title);
      return instance ? (await instance.toJson() as ITopic) : null;
    } catch (error) {
      throw error;
    }
  }

  async findTopicById(id: string): Promise<ITopic> {
    try {
      const topic = await this.findOne(id);
      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
      return topic;
    } catch (error) {
      throw error;
    }
  }

  async updateTopicById(id: string, data: Partial<ITopic>): Promise<ITopic> {
    try {
      const topic = await this.update(id, data);
      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
      return topic;
    } catch (error) {
      throw error;
    }
  }

  async deleteTopicById(id: string): Promise<void> {
    try {
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new NotFoundException('Topic not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findByDomainId(domainId: string): Promise<ITopic[]> {
    try {
      const domain = await this.domainService.findOneWithRelations(domainId);

      if (!domain) {
        throw new NotFoundException(`Domain with id ${domainId} not found`);
      }

      if (!domain.topics || !Array.isArray(domain.topics)) {
        return [];
      }

      return domain.topics
        .filter(topic => topic)
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      this.logger.error('Error finding topics by domain:', error);
      throw error;
    }
  }

  // Bulk operations for topics
  async createTopicsBatch(
    transaction: TNeo4jTransaction,
    topics: Array<{ id: string, title: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $topics AS topic
        MERGE (t:Topic {title: topic.title})
        ON CREATE SET 
          t.id = topic.id,
          t.createdAt = datetime(),
          t.updatedAt = datetime()
        ON MATCH SET 
          t.updatedAt = datetime()
      `;

      await transaction.run(query, { topics });
    } catch (error) {
      throw error;
    }
  }

  async createTopicThemeRelationships(
    transaction: TNeo4jTransaction,
    relationships: Array<{ topicId: string, themeId: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $relationships AS rel
        MATCH (t:Topic {id: rel.topicId})
        MATCH (th:Theme {id: rel.themeId})
        MERGE (t)-[:HAS_THEME]->(th)
      `;

      await transaction.run(query, { relationships });
    } catch (error) {
      throw error;
    }
  }
}
