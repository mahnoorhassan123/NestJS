export class ImageEntity {
  id: number;
  tableId: number;
  tableName: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: Date | null;
  isThumb: boolean | null;
}