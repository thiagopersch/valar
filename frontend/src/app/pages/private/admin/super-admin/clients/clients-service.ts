import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from 'app/model/client';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  getClients(page: number, pageSize: number): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(
      `${this.baseUrl}/admin/clients?page=${page}&pageSize=${pageSize}`,
    );
  }
}
