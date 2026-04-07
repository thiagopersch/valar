import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CrudComponent } from 'app/components/crud/crud';
import { ActionsProps, ColumnDefinitionsProps } from 'app/components/crud/interfaces';
import { ModalService } from 'app/components/modal/modal-service';
import { MESSAGES } from 'app/components/toast/messages';
import { ToastService } from 'app/components/toast/toast-service';
import { ModalAction } from 'app/model/Modal';
import { TransactionCategory } from 'app/model/TransactionCategory';
import { Subject } from 'rxjs';
import { TransactionCategoryForm } from './shared/transaction-category-form/transaction-category-form';
import { TransactionCategoriesService } from './transaction-categories-service';

@Component({
  selector: 'app-transaction-categories',
  templateUrl: './transaction-categories.html',
  styleUrl: './transaction-categories.css',
  imports: [CrudComponent],
})
export class TransactionCategories {
  private transactionCategoriesService = inject(TransactionCategoriesService);
  private modal = inject(ModalService);
  private toastService = inject(ToastService);

  transactionCategories = signal<TransactionCategory[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);
  columns: ColumnDefinitionsProps[] = [
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'type', header: 'Tipo', type: 'text' },
    { key: 'color', header: 'Cor', type: 'color' },
    { key: 'icon', header: 'Ícone', type: 'icon' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
    { key: 'updated_at', header: 'Atualizado em', type: 'datetime' },
  ];
  actions: ActionsProps[] = [
    {
      label: 'Editar',
      icon: 'edit',
      type: 'default',
      action: (transactionCategory: TransactionCategory) => this.onEdit(transactionCategory),
    },
    {
      label: 'Excluir',
      icon: 'delete',
      type: 'delete',
      action: (transactionCategory: TransactionCategory) => this.onDelete(transactionCategory),
    },
  ];

  ngOnInit(): void {
    this.loadTransactionCategories();
  }

  loadTransactionCategories(): void {
    this.isLoading.set(true);
    this.transactionCategoriesService
      .getTransactionCategories(this.pageIndex(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.transactionCategories.set(response.data);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransactionCategories();
  }

  onFilterChange(event: any): void {
    this.pageIndex.set(0);
    this.loadTransactionCategories();
  }

  onAdd(): void {
    const submitSubject = new Subject<void>();
    const formActions: ModalAction[] = [
      { label: 'Cancelar', variant: 'outlined', style: 'error', action: () => modal.close() },
      {
        label: 'Concluir',
        variant: 'filled',
        style: 'primary',
        action: () => submitSubject.next(),
      },
    ];

    const modal = this.modal.openModal(
      `id-${Date.now()}`,
      TransactionCategoryForm,
      'Adicionando uma categoria de transação',
      true,
      true,
      { submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.transactionCategoriesService.saveTransactionCategory(result).subscribe({
          next: () => {
            this.toastService.openSuccess(MESSAGES.CREATE_SUCCESS);
            this.loadTransactionCategories();
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onEdit(transactionCategory: TransactionCategory): void {
    const submitSubject = new Subject<void>();
    const formActions: ModalAction[] = [
      { label: 'Cancelar', variant: 'outlined', style: 'error', action: () => modal.close() },
      {
        label: 'Atualizar',
        variant: 'filled',
        style: 'primary',
        action: () => submitSubject.next(),
      },
    ];

    const modal = this.modal.openModal(
      `id-${Date.now()}`,
      TransactionCategoryForm,
      `Editando a categoria de transação: ${transactionCategory.name}`,
      true,
      true,
      { transactionCategory, submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.transactionCategoriesService.updateTransactionCategory(result).subscribe({
          next: () => {
            this.toastService.openSuccess(MESSAGES.UPDATE_SUCCESS);
            this.loadTransactionCategories();
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onDelete(transactionCategory: TransactionCategory): void {
    const modal = this.modal.openModal(
      `id-${Date.now()}`,
      null as any,
      `Excluindo a categoria de transação: ${transactionCategory.name}`,
      true,
      true,
      { transactionCategory },
      `
            <div class="p-4">
                <p>Tem certeza que deseja excluir a categoria de transação: ${transactionCategory.name}?</p>
            </div>
            `,
      false,
      [
        { label: 'Cancelar', variant: 'outlined', style: 'error', action: () => modal.close() },
        {
          label: 'Excluir',
          variant: 'filled',
          style: 'primary',
          action: () => modal.close(transactionCategory),
        },
      ],
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.transactionCategoriesService.deleteTransactionCategory(result.id).subscribe({
          next: () => {
            this.toastService.openSuccess(MESSAGES.DELETE_SUCCESS);
            this.loadTransactionCategories();
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }
}
