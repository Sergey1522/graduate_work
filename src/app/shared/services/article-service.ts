import { inject, Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopArticleType } from '../../../types/top.article.type';
import { AllArticleType } from '../../../types/all.article.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrlTop = Environments.api + 'articles/top';
  private apiUrlAll = Environments.api + 'articles';
  private http = inject(HttpClient);

  getTopArticle(): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(this.apiUrlTop);
  }
  getArticles(): Observable<AllArticleType> {
    return this.http.get<AllArticleType>(this.apiUrlAll);
  }
}
