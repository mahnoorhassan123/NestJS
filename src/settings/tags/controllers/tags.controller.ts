import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { TagsService } from '../services/tags.service';
import { CreateTagDto, UpdateTagDto } from '../dtos/tags.dto';
import { Response } from 'express';
@Controller('settings/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getTags(
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    if (q) {
      return this.tagsService.searchTags(q, +page, +limit, sortBy, order);
    }
    return this.tagsService.getTags(+page, +limit, sortBy, order);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Get(':id')
  async getTagById(@Param('id') id: string) {
    return this.tagsService.getTagById(+id);
  }
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updateTag(+id, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    return this.tagsService.deleteTag(+id);
  }

  @Get('export')
  async exportTag(@Res() res: Response) {
    const csvData = await this.tagsService.exportTags();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment: filename = tags.csv');
    res.send(csvData);
  }

  @Get('types')
  @HttpCode(HttpStatus.OK)
  getTagsTypes() {
    return this.tagsService.getTagsTypes();
  }

  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  async getTagSuggestions(@Query('q') q: string) {
    if (!q || q.length < 2) {
      return [];
    }
    return this.tagsService.getTagSuggestions(q);
  }
}
