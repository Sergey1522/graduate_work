import { inject, Injectable } from '@angular/core';
import { CategoriesType } from '../../../types/categories.type';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = Environments.api + 'categories';
  private http = inject(HttpClient);
  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(this.apiUrl);
  }
}
