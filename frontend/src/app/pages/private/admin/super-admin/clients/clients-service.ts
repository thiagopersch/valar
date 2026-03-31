import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from 'app/model/client';
import { System } from 'app/model/system';
import { User } from 'app/model/user';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../projects/projects-service';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  private readonly http = inject(HttpClient);

  getClients(page: number, pageSize: number): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(
      `${this.baseUrl}/clients?page=${page}&pageSize=${pageSize}`,
    );
  }

  getUsers(): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/users`);
  }

  getSystems(): Observable<PaginatedResponse<System>> {
    return this.http.get<PaginatedResponse<System>>(`${this.baseUrl}/systems`);
  }

  save(data: any, id?: string): Observable<Client> {
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
      return this.http.post<Client>(`${this.baseUrl}/clients/${id}`, formData);
    }

    return this.http.post<Client>(`${this.baseUrl}/clients`, formData);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }
}
