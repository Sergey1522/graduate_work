import { UserType } from './user.type';

export type CommentType = {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: UserType;
};
