export class UserEntity {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  userType: 'admin' | 'user' | 'external';
  orderExportColumns?: string;
  lastPasUpdate?: Date;
  active?: boolean;
  isBlocked: boolean;
  blockMailSent: boolean;
  token?: string;
  googleId?: string;
  profilePicture?: string;
  googleAccessToken?: string;
  createdAt: Date;
  modifiedBy?: number;
  createdBy?: number;
  modifiedAt?: Date;
}
