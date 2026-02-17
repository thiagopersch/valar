import { Component, inject, signal } from '@angular/core';
import { ActionsProps, CrudComponent } from 'app/components/crud/crud';
import { ModalService } from 'app/components/modal/modal-service';
import { Client } from 'app/model/client';
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
  columns = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'url', header: 'URL', type: 'text' },
    { key: 'email', header: 'E-mail', type: 'text' },
    { key: 'contactName', header: 'Contato', type: 'text' },
    { key: 'phone', header: 'Telefone', type: 'text' },
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
    { key: 'updated_at', header: 'Atualizado em', type: 'datetime' },
  ];
  actions: ActionsProps[] = [
    { label: 'Editar', action: this.onEdit, icon: 'edit', type: 'default' },
    {
      label: 'Excluir',
      action: this.onDelete,
      icon: 'delete',
      type: 'delete',
    },
  ];

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
    const modal = this.modal.openModal(
      `id-${Date.now()}`,
      ClientForm,
      'Adicionar Cliente',
      true,
      true,
      {},
      '',
      false,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClients();
      }
    });
  }

  onEdit(client: Client): void {
    // Handle edit client logic
  }

  onDelete(client: Client): void {
    // Handle delete client logic
  }
}
