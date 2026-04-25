import {
  UserDraft as CoreUserDraft,
  UserModel as CoreUserModel,
  UserStatus,
} from '../../../core/models/user.model';

export type UserSummary = CoreUserModel;
export type UserDraft = CoreUserDraft;
export type { UserStatus };
