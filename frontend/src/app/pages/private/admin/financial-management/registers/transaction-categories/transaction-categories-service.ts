import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginatedResponse } from 'app/model/PaginateResponse';
import { TransactionCategory } from 'app/model/TransactionCategory';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionCategoriesService {
  private readonly baseUrl = `${environment.apiUrl}/admin/transaction-categories`;
  private readonly http = inject(HttpClient);

  getTransactionCategories(
    page: number,
    pageSize: number,
  ): Observable<PaginatedResponse<TransactionCategory>> {
    return this.http.get<PaginatedResponse<TransactionCategory>>(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`,
    );
  }

  saveTransactionCategory(data: TransactionCategory): Observable<TransactionCategory> {
    return this.http.post<TransactionCategory>(this.baseUrl, data);
  }

  updateTransactionCategory(data: TransactionCategory): Observable<TransactionCategory> {
    return this.http.put<TransactionCategory>(`${this.baseUrl}/${data.id}`, data);
  }

  deleteTransactionCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
