import { File, User } from '@prisma/client';
import { FileResponseDto } from '../dtos/files.dto';

export class FileMapper {
  static toDto(file: File, user: User): FileResponseDto {
    const dto = new FileResponseDto();

    dto.FileID = file.id;
    dto.FileName = file.title;
    dto.FileExt = file.fileExt;
    dto.FileURL = file.URL;
    dto.TableName = file.tableName;
    dto.TableID = file.tableId;
    dto.CreatedBy = file.createdBy;
    dto.CreatedAt = file.createdAt.toISOString();
    dto.IsActive = file.isActive ? 1 : 0;
    dto.firstname = user.firstname ?? '';
    dto.lastname = user.lastname ?? '';

    return dto;
  }
}
