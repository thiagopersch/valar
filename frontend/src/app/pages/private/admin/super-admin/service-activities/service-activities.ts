import { Component, inject, signal } from '@angular/core';
import { CrudComponent } from 'app/components/crud/crud';
import { ActionsProps, ColumnDefinitionsProps } from 'app/components/crud/interfaces';
import { ModalService } from 'app/components/modal/modal-service';
import { ModalAction } from 'app/model/Modal';
import { ServiceActivity } from 'app/model/service-activity';
import { Subject } from 'rxjs';
import { ServiceActivitiesService } from './service-activities-service';
import { ServiceActivityForm } from './shared/service-activity-form/service-activity-form';

@Component({
  selector: 'app-service-activities',
  templateUrl: './service-activities.html',
  styleUrl: './service-activities.css',
  imports: [CrudComponent],
})
export class ServiceActivitiesComponent {
  private service = inject(ServiceActivitiesService);
  private modal = inject(ModalService);

  activities = signal<ServiceActivity[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);

  columns: ColumnDefinitionsProps[] = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'description', header: 'Descrição', type: 'text' },
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
  ];

  actions: ActionsProps[] = [
    {
      label: 'Editar',
      action: (activity: ServiceActivity) => this.onEdit(activity),
      icon: 'edit',
      type: 'default',
    },
    {
      label: 'Excluir',
      action: (activity: ServiceActivity) => this.onDelete(activity),
      icon: 'delete',
      type: 'delete',
    },
  ];

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading.set(true);
    this.service.getServiceActivities().subscribe({
      next: (response) => {
        this.activities.set(response.data);
        this.total.set(response.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
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
      ServiceActivityForm,
      'Adicionar Atividade',
      true,
      true,
      { submitSubject },
      '',
      true,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.service.createServiceActivity(result).subscribe(() => this.loadActivities());
      }
    });
  }

  onEdit(activity: ServiceActivity): void {
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
      ServiceActivityForm,
      `Editando: ${activity.name}`,
      true,
      true,
      { serviceActivity: activity, submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.service
          .updateServiceActivity(activity.id, result)
          .subscribe(() => this.loadActivities());
      }
    });
  }

  onDelete(activity: ServiceActivity): void {
    if (confirm(`Deseja excluir a atividade ${activity.name}?`)) {
      this.service.deleteServiceActivity(activity.id).subscribe(() => this.loadActivities());
    }
  }
}
