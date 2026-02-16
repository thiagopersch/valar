import { Component, signal } from '@angular/core';
import { CrudComponent } from 'app/components/crud/crud';
import { Client } from 'app/model/client';
import { ClientsService } from './clients-service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.html',
  styleUrl: './clients.css',
  imports: [CrudComponent],
})
export class Clients {
  columns = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
    { key: 'phone', header: 'Telefone', type: 'text' },
    { key: 'address', header: 'Endereço', type: 'text' },
    { key: 'city', header: 'Cidade', type: 'text' },
    { key: 'state', header: 'Estado', type: 'text' },
    { key: 'zip', header: 'CEP', type: 'text' },
    { key: 'country', header: 'País', type: 'text' },
    { key: 'createdAt', header: 'Criado em', type: 'date' },
    { key: 'updatedAt', header: 'Atualizado em', type: 'date' },
  ];

  clients = signal<Client[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);

  constructor(private clientService: ClientsService) {}

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
    // Handle add client logic
  }

  onEdit(client: Client): void {
    // Handle edit client logic
  }

  onDelete(client: Client): void {
    // Handle delete client logic
  }
}
