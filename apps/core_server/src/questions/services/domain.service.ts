import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../../database/neode.service';
import { NEO4J_TOKEN, TNeo4jTransaction, TNeo4jRecord } from '../../database';
import { EEntities } from '../../database/model';
import { TDomain } from '../../database/schemas/domain.schema';
import { TTopic } from '../../database/schemas/topic.schema';

@Injectable()
export class DomainService extends BaseNeodeService<TDomain, Partial<TDomain>, Partial<TDomain>> {
  protected readonly logger = new Logger(DomainService.name);

  constructor(@Inject(NEO4J_TOKEN) neode: Neode) {
    super(neode, EEntities.Domain);
  }

  async findOneByTitle(title: string): Promise<TDomain | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('title', title);
      return instance ? (await instance.toJson() as TDomain) : null;
    } catch (error) {
      throw error;
    }
  }

  async findDomainById(id: string): Promise<TDomain> {
    try {
      const domain = await this.findOne(id);
      if (!domain) {
        throw new NotFoundException('Domain not found');
      }
      return domain;
    } catch (error) {
      throw error;
    }
  }

  async updateDomainById(id: string, data: Partial<TDomain>): Promise<TDomain> {
    try {
      const domain = await this.update(id, data);
      if (!domain) {
        throw new NotFoundException('Domain not found');
      }
      return domain;
    } catch (error) {
      throw error;
    }
  }

  async deleteDomainById(id: string): Promise<void> {
    try {
      const deleted = await this.delete(id);
      if (!deleted) {
        throw new NotFoundException('Domain not found');
      }
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations for domains
  async createDomainsBatch(
    transaction: TNeo4jTransaction,
    domains: Array<{ id: string, title: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $domains AS domain
        MERGE (d:Domain {title: domain.title})
        ON CREATE SET 
          d.id = domain.id,
          d.createdAt = datetime(),
          d.updatedAt = datetime()
        ON MATCH SET 
          d.updatedAt = datetime()
      `;

      await transaction.run(query, { domains });
      this.logger.debug(`Created ${domains.length} Domain nodes`);
    } catch (error) {
      this.logger.error('Error creating domains batch:', error);
      throw error;
    }
  }

  async findOrCreateDomainsByTitle(
    domainTitles: string[]
  ): Promise<Map<string, TDomain>> {
    try {
      const domainsMap = new Map<string, TDomain>();

      for (const title of domainTitles) {
        const domain = await this.findOrCreateByTitle(title, { title });
        domainsMap.set(title, domain);
      }

      return domainsMap;
    } catch (error) {
      this.logger.error('Error finding or creating domains:', error);
      throw error;
    }
  }

  async createDomainTopicRelationships(
    transaction: TNeo4jTransaction,
    relationships: Array<{ domainId: string, topicId: string }>
  ): Promise<void> {
    try {
      const query = `
        UNWIND $relationships AS rel
        MATCH (d:Domain {id: rel.domainId})
        MATCH (t:Topic {id: rel.topicId})
        MERGE (d)-[:HAS_TOPIC]->(t)
      `;

      await transaction.run(query, { relationships });
      this.logger.debug(`Created ${relationships.length} Domain->Topic relationships`);
    } catch (error) {
      this.logger.error('Error creating domain-topic relationships:', error);
      throw error;
    }
  }

  async getDomainsWithTopics(): Promise<TDomain[]> {
    try {
      const query = `
        MATCH (d:Domain)
        OPTIONAL MATCH (d)-[:HAS_TOPIC]->(t:Topic)
        RETURN d, collect(t) as topics
        ORDER BY d.title
      `;

      const session = this.neode.session();
      const result = await session.run(query);
      await session.close();

      return result.records.map((record: TNeo4jRecord) => {
        const domain = record.get('d').properties;
        const topics = record.get('topics').map((t: { properties: TTopic }) => t.properties);
        return { ...domain, topics } as TDomain;
      });
    } catch (error) {
      this.logger.error('Error getting domains with topics:', error);
      throw error;
    }
  }
}
