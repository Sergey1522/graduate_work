import { inject, Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestsType } from '../../../types/requests.type';
import { DefaultResponseType } from '../../../types/default.response.type';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private apiUrl = Environments.api + 'requests';
  private http = inject(HttpClient);

  createRequest(data: RequestsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(this.apiUrl, data);
  }
}
