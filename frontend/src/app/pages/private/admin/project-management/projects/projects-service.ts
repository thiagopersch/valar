import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project } from 'app/model/project';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly baseUrl = `${environment.apiUrl}/admin/projects`;
  private readonly http = inject(HttpClient);

  getProjects(): Observable<PaginatedResponse<Project>> {
    return this.http
      .get<{ data: Project[] }>(`${this.baseUrl}`)
      .pipe(map((res) => ({ data: res.data, total: res.data.length })));
  }

  createProject(data: Project): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}`, data);
  }

  updateProject(id: string, data: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, data);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
