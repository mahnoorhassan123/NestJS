import { Tag as PrismaTag } from '@prisma/client';
import { TagResponseDto } from '../dtos/tags.dto';
export class TagMapper {
  static toDto(tag: PrismaTag): TagResponseDto {
    const dto = new TagResponseDto();

    dto.id = String(tag.id);
    dto.title = tag.title;
    dto.description = tag.description ?? '';
    dto.backgroundColor = tag.backgroundColor;
    dto.isActive = tag.active ? 1 : 0;
    dto.createdBy = tag.createdBy;
    dto.updatedBy = tag.createdBy;
    dto.color = tag.color;
    dto.typeId = tag.typeId;
    dto.createdAt = tag.createdAt.toISOString();
    dto.updatedAt = tag.updatedAt.toISOString();

    return dto;
  }
}
