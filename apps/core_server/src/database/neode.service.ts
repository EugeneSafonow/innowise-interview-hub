import { Inject, Injectable, Logger } from '@nestjs/common';
import Neode from 'neode';

import { NEO4J_TOKEN } from './neode.provider';

import { EUserRole } from '@/common/models';

@Injectable()
export abstract class BaseNeodeService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected readonly logger = new Logger(BaseNeodeService.name);
  protected modelName: string;
  constructor(
    @Inject(NEO4J_TOKEN) protected readonly neode: Neode,
    modelName: string
  ) {
    this.modelName = modelName;
  }

  setModel(modelName: string) {
    this.modelName = modelName;
  }

  async create(data: CreateDto): Promise<T> {
    try {
      const instance = await this.neode.model(this.modelName).create(data);
      return instance.toJson() as T;
    } catch (error) {
      this.logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async findAllByRole(role: EUserRole): Promise<T[]> {
    try {
      const instances = await this.neode.model(this.modelName).all({ role });
      const promises = instances.map((node: Neode.Node<T>) => node.toJson()) as T[];
      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Error fetching all ${this.modelName}:`, error);
      throw error;
    }
  }

  async findRelated(id: string, relationship: string) {
    try {
      const instance = await this.neode.model(this.modelName).first('id', id);
      if (!instance) return [];

      const relatedData = instance.get(relationship);

      return relatedData;
    } catch (error) {
      this.logger.error(`Error fetching related ${relationship} for ${this.modelName}:`, error);
      throw error;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const instances = await this.neode.model(this.modelName).all();
      const promises = instances.map((node: Neode.Node<T>) => node.toJson()) as T[];
      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Error fetching all ${this.modelName}:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('id', id);
      return instance ? (instance.toJson() as T) : null;
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName} by id:`, error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private unpackRelationsRecursively(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.unpackRelationsRecursively(item));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object') {
        if ('_type' in value && 'node' in value) {
          result[key] = this.unpackRelationsRecursively(value.node);
        } else if (Array.isArray(value) && value.length > 0) {
          const firstItem = value[0];
          if (firstItem && typeof firstItem === 'object' && '_type' in firstItem && 'node' in firstItem) {
            result[key] = value.map(rel => this.unpackRelationsRecursively(rel.node));
          } else {
            result[key] = this.unpackRelationsRecursively(value);
          }
        } else if (Array.isArray(value)) {
          result[key] = [];
        } else {
          result[key] = this.unpackRelationsRecursively(value);
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  async findOneWithRelations(id: string): Promise<T | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('id', id);
      if (!instance) return null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeData = await instance.toJson() as any;

      const unpackedData = this.unpackRelationsRecursively(nodeData);
      return unpackedData as T;
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName} with relations by id:`, error);
      throw error;
    }
  }

  async findManyWithRelations(ids: string[]): Promise<T[]> {
    try {
      if (ids.length === 0) return [];

      const instances = await this.neode.model(this.modelName).all({ id: { $in: ids } });
      const results: T[] = [];

      for (const instance of instances) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodeData = await instance.toJson() as any;

        const unpackedData = this.unpackRelationsRecursively(nodeData);
        results.push(unpackedData as T);
      }

      return results;
    } catch (error) {
      this.logger.error(`Error finding multiple ${this.modelName} with relations:`, error);
      throw error;
    }
  }

  async findByEmailAndName(name?: string, email?: string): Promise<T[]> {
    try {
      const query: Partial<{
        name: string,
        email: string,
        role: EUserRole.Candidate,
      }> = { role: EUserRole.Candidate };
      if (name) {
        query.name = name;
      }
      if (email) {
        query.email = email;
      }

      const instances = await this.neode.model(this.modelName).all(query);
      const promises = instances.map((node: Neode.Node<T>) => node.toJson()) as T[];
      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Error fetching all ${this.modelName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: UpdateDto): Promise<T | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('id', id);
      if (!instance) return null;
      await instance.update(data);
      return instance.toJson() as T;
    } catch (error) {
      this.logger.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const instance = await this.neode.model(this.modelName).first('id', id);
      if (!instance) return false;
      await instance.delete();
      return true;
    } catch (error) {
      this.logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  async createMany(data: CreateDto[]): Promise<T[]> {
    try {
      const promises = data.map(item => this.neode.model(this.modelName).create(item));
      const instances = await Promise.all(promises);
      return await Promise.all(instances.map(instance => instance.toJson())) as T[];
    } catch (error) {
      this.logger.error(`Error creating multiple ${this.modelName}:`, error);
      throw error;
    }
  }

  async findOrCreateByTitle(title: string, defaultData: CreateDto): Promise<T> {
    try {
      const existing = await this.neode.model(this.modelName).first('title', title);
      if (existing) {
        return existing.toJson() as T;
      }

      const instance = await this.neode.model(this.modelName).create(defaultData);
      return instance.toJson() as T;
    } catch (error) {
      this.logger.error(`Error finding or creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async createRelationship(
    fromId: string,
    toId: string,
    relationshipType: string,
    targetModelName: string
  ): Promise<void> {
    try {
      const fromNode = await this.neode.model(this.modelName).first('id', fromId);
      if (!fromNode) {
        throw new Error(`Source ${this.modelName} with id ${fromId} not found`);
      }

      const toNode = await this.neode.model(targetModelName).first('id', toId);
      if (!toNode) {
        throw new Error(`Target ${targetModelName} with id ${toId} not found`);
      }

      await fromNode.relateTo(toNode, relationshipType);
    } catch (error) {
      this.logger.error(`Error creating relationship ${relationshipType}:`, error);
      throw error;
    }
  }

  async executeInTransaction<R>(operations: (() => Promise<R>)[]): Promise<R[]> {
    const session = this.neode.session();
    const transaction = session.beginTransaction();

    try {
      const results = [];
      for (const operation of operations) {
        const result = await operation();
        results.push(result);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Transaction failed for ${this.modelName}:`, error);
      throw error;
    } finally {
      await session.close();
    }
  }
}
