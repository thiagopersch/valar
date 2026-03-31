import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { System } from 'app/model/system';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../projects/projects-service';

@Injectable({
  providedIn: 'root',
})
export class SystemsService {
  private readonly baseUrl = `${environment.apiUrl}/admin/systems`;
  private readonly http = inject(HttpClient);

  getAll(page: number, pageSize: number): Observable<PaginatedResponse<System>> {
    return this.http.get<PaginatedResponse<System>>(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`,
    );
  }

  save(system: System): Observable<System> {
    return this.http.post<System>(this.baseUrl, system);
  }

  update(system: System, id: string): Observable<System> {
    return this.http.put<System>(`${this.baseUrl}/${id}`, system);
  }

  delete(id: string): Observable<System> {
    return this.http.delete<System>(`${this.baseUrl}/${id}`);
  }
}
