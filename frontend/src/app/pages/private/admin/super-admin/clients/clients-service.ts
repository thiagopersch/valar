import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from 'app/model/client';
import { ServiceActivity } from 'app/model/service-activity';
import { System } from 'app/model/system';
import { User } from 'app/model/user';
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

  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(`${this.baseUrl}/admin/users`);
  }

  getSystems(): Observable<{ data: System[] }> {
    return this.http.get<{ data: System[] }>(`${this.baseUrl}/admin/systems`);
  }

  getServiceActivities(): Observable<{ data: ServiceActivity[] }> {
    return this.http.get<{ data: ServiceActivity[] }>(`${this.baseUrl}/admin/service-activities`);
  }

  save(data: any, id?: string): Observable<any> {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key];

      if (value === null || value === undefined) continue;

      // Só envia arquivos se forem instâncias de File
      if (['logo', 'favicon', 'background'].includes(key)) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value === 'REMOVE') {
          formData.append(key, '');
        }
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    }

    if (id) {
      formData.append('_method', 'PUT');
      return this.http.post(`${this.baseUrl}/admin/clients/${id}`, formData);
    }

    return this.http.post(`${this.baseUrl}/admin/clients`, formData);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/clients/${id}`);
  }
}
