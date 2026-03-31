import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CrudComponent } from 'app/components/crud/crud';
import { ActionsProps, ColumnDefinitionsProps } from 'app/components/crud/interfaces';
import { ModalService } from 'app/components/modal/modal-service';
import { ModalAction } from 'app/model/Modal';
import { System } from 'app/model/system';
import { Subject } from 'rxjs';
import { SystemForm } from './shared/system-form/system-form';
import { SystemsService } from './systems-service';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.html',
  styleUrl: './systems.css',
  imports: [CrudComponent],
})
export class Systems {
  private systemService = inject(SystemsService);
  private modal = inject(ModalService);

  constructor() {}

  systems = signal<System[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);
  columns: ColumnDefinitionsProps[] = [
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'code', header: 'Código', type: 'text' },
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'fantasy_name', header: 'Nome Fantasia', type: 'text' },
    { key: 'description', header: 'Descrição', type: 'text' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
    { key: 'updated_at', header: 'Atualizado em', type: 'datetime' },
  ];
  actions: ActionsProps[] = [
    {
      label: 'Editar',
      action: (system: System) => this.onEdit(system),
      icon: 'edit',
      type: 'default',
    },
    {
      label: 'Excluir',
      action: (system: System) => this.onDelete(system),
      icon: 'delete',
      type: 'delete',
    },
  ];

  ngOnInit(): void {
    this.loadSystems();
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
      SystemForm,
      'Adicionando um sistema',
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
        this.systemService.save(result).subscribe({
          next: () => {
            this.loadSystems();
          },
          error: () => {
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onEdit(system: System) {
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
      SystemForm,
      `Editando o sistema: ${system.name}`,
      true,
      true,
      { system, submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.systemService.update(result, system.id!).subscribe({
          next: () => {
            this.loadSystems();
          },
          error: () => {
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  onDelete(system: System) {
    if (confirm(`Tem certeza que deseja excluir o sistema ${system.name}?`)) {
      this.isLoading.set(true);
      this.systemService.delete(system.id!).subscribe({
        next: () => {
          this.loadSystems();
        },
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadSystems();
  }

  onFilterChange(event: any) {
    this.pageIndex.set(0);
    this.loadSystems();
  }

  loadSystems() {
    this.isLoading.set(true);
    this.systemService.getAll(this.pageIndex(), this.pageSize()).subscribe((response) => {
      this.systems.set(response.data);
      this.total.set(response.total);
      this.isLoading.set(false);
    });
  }
}
