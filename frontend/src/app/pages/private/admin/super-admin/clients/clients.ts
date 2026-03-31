import { Component, inject, signal } from '@angular/core';
import { CrudComponent } from 'app/components/crud/crud';
import { ActionsProps, ColumnDefinitionsProps } from 'app/components/crud/interfaces';

import { ModalService } from 'app/components/modal/modal-service';
import { Client } from 'app/model/client';
import { ModalAction } from 'app/model/Modal';
import { Subject } from 'rxjs';
import { ClientsService } from './clients-service';
import { ClientForm } from './shared/client-form/client-form';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.html',
  styleUrl: './clients.css',
  imports: [CrudComponent],
})
export class ClientsComponent {
  private clientService = inject(ClientsService);
  private modal = inject(ModalService);

  constructor() {}

  clients = signal<Client[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);
  columns: ColumnDefinitionsProps[] = [
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'url', header: 'URL', type: 'text' },
    { key: 'email', header: 'E-mail', type: 'text' },
    { key: 'contact_name', header: 'Contato', type: 'text' },
    { key: 'phone', header: 'Telefone', type: 'text' },
    { key: 'contract_start_date', header: 'Início do Contrato', type: 'date' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
    { key: 'updated_at', header: 'Atualizado em', type: 'datetime' },
  ];
  actions: ActionsProps[] = [
    {
      label: 'Projetos',
      action: (client: Client) => this.onViewProjects(client),
      icon: 'assignment',
      type: 'default',
    },
    {
      label: 'Editar',
      action: (client: Client) => this.onEdit(client),
      icon: 'edit',
      type: 'default',
    },
    {
      label: 'Excluir',
      action: (client: Client) => this.onDelete(client),
      icon: 'delete',
      type: 'delete',
    },
  ];

  onViewProjects(client: Client): void {
    const formActions: ModalAction[] = [
      { label: 'Fechar', variant: 'outlined', style: 'primary', action: () => modal.close() },
    ];

    const modal = this.modal.openModal(
      `projects-${client.id}`,
      null as any, // We'll use a dynamic template or a simple component
      `Atividades de Serviços: ${client.name}`,
      true,
      true,
      { client },
      `
      <div class="p-4">
        @if (data.client.service_activities && data.client.service_activities.length > 0) {
          <div class="flex flex-col gap-2">
            @for (activity of data.client.service_activities; track activity.id) {
              <div class="p-3 border rounded-lg bg-neutral-50 flex items-center gap-3">
                <mat-icon class="text-primary-500">check_circle</mat-icon>
                <div class="flex flex-col">
                  <span class="font-medium text-neutral-800">{{ activity.name }}</span>
                  <span class="text-xs text-neutral-500">{{ activity.description }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-8 text-neutral-400 gap-2">
            <mat-icon class="text-4xl">inventory_2</mat-icon>
            <span>Nenhuma atividade de serviço vinculada.</span>
          </div>
        }
      </div>
      `,
      false,
      formActions,
    );
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.clientService.getClients(this.pageIndex(), this.pageSize()).subscribe({
      next: (response) => {
        this.clients.set(response.data);
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

  onPageChange(event: any): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadClients();
  }

  onFilterChange(event: any): void {
    this.pageIndex.set(0);
    this.loadClients();
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
      ClientForm,
      'Adicionar Cliente',
      true,
      true,
      { submitSubject },
      '',
      true,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.clientService.save(result).subscribe({
          next: () => {
            this.loadClients();
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onEdit(client: Client): void {
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
      ClientForm,
      `Editando o cliente: ${client.name}`,
      true,
      true,
      { client, submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.clientService.save(result, client.id).subscribe({
          next: () => {
            this.loadClients();
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onDelete(client: Client): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      this.isLoading.set(true);
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.loadClients();
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }
}
