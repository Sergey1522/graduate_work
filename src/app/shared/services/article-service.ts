import { inject, Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopArticleType } from '../../../types/top.article.type';
import { AllArticleType } from '../../../types/all.article.type';
import { DetailedArticleType } from '../../../types/detailed.article.type';
import { DetailedArticleCommentsType } from '../../../types/detailed.article.comments.type';
import { CommentType } from '../../../types/comment.type';
import { DefaultResponseType } from '../../../types/default.response.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  reactToComment(articleId: string, id: string, value: number) {
    throw new Error('Method not implemented.');
  }
  private apiUrlTop = Environments.api + 'articles/top';
  private apiUrlAll = Environments.api + 'articles';
  private apiUrlDetailed = Environments.api + 'articles/';
  private apiUrlDetailedRelated = Environments.api + 'articles/related/';
  private http = inject(HttpClient);

  getTopArticle(): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(this.apiUrlTop);
  }
  getArticles(params: { page: number }): Observable<AllArticleType> {
    let httpParams = new HttpParams().set('page', params.page);
    return this.http.get<AllArticleType>(this.apiUrlAll, {
      params: httpParams,
    });
  }
  getDetiledArticle(url: string): Observable<DetailedArticleType> {
    return this.http.get<DetailedArticleType>(this.apiUrlDetailed + url);
  }
  getDetiledRelatedArticle(url: string | undefined): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(this.apiUrlDetailedRelated + url);
  }
  addComment(articleId: string, text: string): Observable<DetailedArticleType> {
    return this.http.post<DetailedArticleType>(Environments.api + 'comments', {
      text,
      article: articleId,
    });
  }
  getComments(articleId: string, offset: number = 0) {
    return this.http.get<{ allCount: number; comments: CommentType[] }>(
      Environments.api + 'comments',
      { params: { article: articleId, offset } },
    );
  }
  applyCommentAction(
    commentId: string,
    action: 'like' | 'dislike' | 'violate',
  ): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      Environments.api + 'comments/' + commentId + '/apply-action',
      { action },
    );
  }
  getArticleCommentActions(
    articleId: string,
  ): Observable<{ comment: string; action: 'like' | 'dislike' }[]> {
    return this.http.get<{ comment: string; action: 'like' | 'dislike' }[]>(
      Environments.api + 'comments/article-comment-actions',
      { params: { articleId } },
    );
  }
}
