export class ActivityLogEntity {
  id: number;
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  url?: string;
  lastModifyOn?: Date;
  ipAddress?: string;
  type: 'Store' | 'BlueSky';
  env?: string;
}