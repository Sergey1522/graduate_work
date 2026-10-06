import { TopArticleType } from './top.article.type';

export type AllArticleType = {
  items: TopArticleType[];
  count: number;
  pages: number;
};
