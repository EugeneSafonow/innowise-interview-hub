import * as fs from 'fs/promises';
import path from 'path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TAny } from '@packages/shared';

import { IImportExportRequest } from './types/import-export.types';
import { BulkImportService } from './services/bulk-import.service';

@Injectable()
export class ImportService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bulkImportService: BulkImportService
  ) {}

  async importDataStatic(): Promise<TAny> {
    try {
      const filePath = path.resolve(__dirname, '../../../importJson/q.json');
      const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });

      const jsonData: IImportExportRequest = JSON.parse(fileContent);

      const result = await this.bulkImportService.importDataBulk(jsonData);
      return {
        message: 'Static import completed successfully',
        result,
      };
    } catch (error) {
      console.error('import error', error);
      throw new HttpException(`Cant import: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async importDataDynamic(filePath: string): Promise<TAny> {
    try {
      await fs.access(filePath);

      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData: IImportExportRequest = JSON.parse(fileContent);

      const result = await this.bulkImportService.importDataBulk(jsonData);

      await fs.unlink(filePath);

      return {
        message: 'Dynamic import completed successfully',
        result,
      };
    } catch (error: unknown) {
      console.error('import error', error);
      throw new HttpException(`Import error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportData(): Promise<IImportExportRequest> {
    try {
      return await this.bulkImportService.exportDataBulk();
    } catch (error) {
      console.error('export error', error);
      throw new HttpException(`Export error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportDataToFile(filePath: string): Promise<void> {
    try {
      const data = await this.exportData();
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('export to file error', error);
      throw new HttpException(`Export to file error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
