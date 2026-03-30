import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceActivity } from 'app/model/service-activity';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceActivitiesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getServiceActivities(): Observable<PaginatedResponse<ServiceActivity>> {
    return this.http
      .get<{ data: ServiceActivity[] }>(`${this.baseUrl}/admin/service-activities`)
      .pipe(map((res) => ({ data: res.data, total: res.data.length })));
  }

  createServiceActivity(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/service-activities`, data);
  }

  updateServiceActivity(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/service-activities/${id}`, data);
  }

  deleteServiceActivity(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/service-activities/${id}`);
  }
}
