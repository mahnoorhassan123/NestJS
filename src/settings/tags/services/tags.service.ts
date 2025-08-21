import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from '../dtos/tags.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { TagType } from '../dtos/tags.dto';
@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async createTag(data: CreateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({
      where: { title: data.title },
    });
    if (existingTag)
      throw new HttpException('This tag already exists', HttpStatus.CONFLICT);
    const createdTag = await this.prisma.tag.create({ data });
    return { message: 'Tag Created', tag: createdTag };
  }

  async updateTag(id: number, data: UpdateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({ where: { id } });
    if (!existingTag)
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    const updatedTag = await this.prisma.tag.update({ where: { id }, data });
    return { message: 'Tag Updated', tag: updatedTag };
  }

  async deleteTag(id: number) {
    const existingTag = await this.prisma.tag.findUnique({ where: { id } });
    if (!existingTag)
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    await this.prisma.tag.delete({ where: { id } });
    return { message: 'Tag Deleted' };
  }

  async getTags(
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * limit;
    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.tag.count(),
    ]);
    return {
      data: tags,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async searchTags(
    q: string,
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [{ title: { contains: q } }, { description: { contains: q } }],
    };

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.tag.count({ where: whereClause }),
    ]);

    return {
      data: tags,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async exportTags() {
    const tags = await this.prisma.tag.findMany();
    const csvWriter = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'Id' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'active', title: 'Active' },
      ],
    });

    const records = tags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      description: tag.description,
      active: tag.active ? 'Active' : 'In-Active',
    }));
    return csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  }

  getTagsTypes() {
    return Object.values(TagType);
  }
  async getTagSuggestions(query: string) {
    return this.prisma.tag.findMany({
      where: {
        title: { contains: query },
      },
      select: {
        title: true,
      },
      take: 5,
    });
  }
}
