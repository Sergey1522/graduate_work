import { inject, Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopArticleType } from '../../../types/top.article.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = Environments.api + 'articles/top';
  private http = inject(HttpClient);

  getTopArticle(): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(this.apiUrl);
  }
}
