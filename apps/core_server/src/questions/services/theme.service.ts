import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../../database/neode.service';
import { NEO4J_TOKEN } from '../../database/neode.provider';
import { EEntities } from '../../database/model';
import { TTheme } from '../../database/schemas/theme.schema';
import { TopicService } from './topic.service';

import { TNeo4jTransaction } from '@/database';

@Injectable()
export class ThemeService extends BaseNeodeService<TTheme, Partial<TTheme>, Partial<TTheme>> {
  constructor(@Inject(NEO4J_TOKEN) neode: Neode, private readonly topicService: TopicService) {
    super(neode, EEntities.Theme);
  }

  async findOneByTitle(title: string): Promise<TTheme | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('title', title);
      return instance ? (await instance.toJson() as TTheme) : null;
    } catch (error) {
      throw error;
    }
  }

  async findThemeById(id: string): Promise<TTheme> {
    try {
      const theme = await this.findOne(id);
      if (!theme) {
        throw new NotFoundException('Theme not found');
      }
      return theme;
    } catch (error) {
      throw error;
    }
  }

  async updateThemeById(id: string, data: Partial<TTheme>): Promise<TTheme> {
    try {
      const theme = await this.update(id, data);
      if (!theme) {
        throw new NotFoundException('Theme not found');
      }
      return theme;
    } catch (error) {
      throw error;
    }
  }

  async deleteThemeById(id: string): Promise<void> {
    try {
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new NotFoundException('Theme not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findByTopicId(topicId: string): Promise<TTheme[]> {
    try {
      const topic = await this.topicService.findOneWithRelations(topicId);

      if (!topic) {
        throw new NotFoundException(`Topic with id ${topicId} not found`);
      }

      if (!topic.themes || !Array.isArray(topic.themes)) {
        return [];
      }

      return topic.themes
        .filter(theme => theme)
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      this.logger.error('Error finding themes by topic:', error);
      throw error;
    }
  }

  // Bulk operations for themes
  async createThemesBatch(
    transaction: TNeo4jTransaction,
    themes: Array<{ id: string, title: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $themes AS theme
        MERGE (th:Theme {title: theme.title})
        ON CREATE SET 
          th.id = theme.id,
          th.createdAt = datetime(),
          th.updatedAt = datetime()
        ON MATCH SET 
          th.updatedAt = datetime()
      `;

      await transaction.run(query, { themes });
    } catch (error) {
      throw error;
    }
  }
}
