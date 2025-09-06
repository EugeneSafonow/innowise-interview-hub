import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../../database/neode.service';
import { NEO4J_TOKEN, TNeo4jTransaction } from '../../database';
import { EEntities } from '../../database/model';

import { IFollowUpQuestion } from '@/database';

@Injectable()
export class FollowUpQuestionService extends
  BaseNeodeService<IFollowUpQuestion, Partial<IFollowUpQuestion>, Partial<IFollowUpQuestion>> {
  constructor(@Inject(NEO4J_TOKEN) neode: Neode) {
    super(neode, EEntities.FollowUpQuestion);
  }

  async findOneByTitle(title: string): Promise<IFollowUpQuestion | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('title', title);
      return instance ? (await instance.toJson() as IFollowUpQuestion) : null;
    } catch (error) {
      throw error;
    }
  }

  async findFollowUpQuestionById(id: string): Promise<IFollowUpQuestion> {
    try {
      const followUpQuestion = await this.findOne(id);
      if (!followUpQuestion) {
        throw new NotFoundException('Follow-up question not found');
      }
      return followUpQuestion;
    } catch (error) {
      throw error;
    }
  }

  async updateFollowUpQuestionById(id: string, data: Partial<IFollowUpQuestion>): Promise<IFollowUpQuestion> {
    try {
      const followUpQuestion = await this.update(id, data);
      if (!followUpQuestion) {
        throw new NotFoundException('Follow-up question not found');
      }
      return followUpQuestion;
    } catch (error) {
      throw error;
    }
  }

  async deleteFollowUpQuestionById(id: string): Promise<void> {
    try {
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new NotFoundException('Follow-up question not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findFollowUpQuestionsByTags(tags: string[]): Promise<IFollowUpQuestion[]> {
    try {
      const instances = await this.neode.model(this.modelName).all({ tags });
      const promises = instances.map((node: Neode.Node<IFollowUpQuestion>) => node.toJson());
      return await Promise.all(promises) as IFollowUpQuestion[];
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations for follow-up questions
  async createFollowUpQuestionsBatch(
    transaction: TNeo4jTransaction,
    followUpQuestions: Array<{ id: string, title: string, weight: number, tags: string[] }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $followUpQuestions AS fq
        MERGE (f:FollowUpQuestion {title: fq.title})
        ON CREATE SET 
          f.id = fq.id,
          f.weight = fq.weight,
          f.tags = fq.tags,
          f.createdAt = datetime(),
          f.updatedAt = datetime()
        ON MATCH SET 
          f.weight = fq.weight,
          f.tags = fq.tags,
          f.updatedAt = datetime()
      `;

      await transaction.run(query, { followUpQuestions });
    } catch (error) {
      throw error;
    }
  }

  async createQuestionFollowUpRelationships(
    transaction: TNeo4jTransaction,
    relationships: Array<{ questionId: string, followUpId: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $relationships AS rel
        MATCH (q:Question {id: rel.questionId})
        MATCH (fq:FollowUpQuestion {id: rel.followUpId})
        MERGE (q)-[:HAS_FOLLOWUP]->(fq)
      `;

      await transaction.run(query, { relationships });
    } catch (error) {
      throw error;
    }
  }
}
