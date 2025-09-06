import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import Neode from 'neode';

import { BaseNeodeService } from '../database/neode.service';
import { NEO4J_TOKEN } from '../database';
import { EEntities } from '../database/model';
import { TUser } from '../database/types';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService
  extends BaseNeodeService<TUser, CreateUserDTO, UpdateUserDTO> {

  constructor(@Inject(NEO4J_TOKEN) neode: Neode) {
    super(neode, EEntities.User);
  }

  async findOneByEmail(email: string): Promise<TUser | null> {
    try {
      const instance = await this.neode.model(this.modelName).first('email', email);
      return instance ? (await instance.toJson() as TUser) : null;
    } catch (error) {
      throw error;
    }
  }

  async createNewUser(dto: CreateUserDTO) {
    try {
      const user = await this.findOneByEmail(dto.email);
      if (user) {
        throw new BadRequestException('Email already in used');
      }
      return this.create(dto);
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(id: string, dto: UpdateUserDTO) {
    try {
      const user = await this.update(id, dto);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById(id: string) {
    try {
      const user = await this.delete(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
