import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CrudComponent } from 'app/components/crud/crud';
import { ActionsProps, ColumnDefinitionsProps } from 'app/components/crud/interfaces';
import { ModalService } from 'app/components/modal/modal-service';
import { ModalAction } from 'app/model/Modal';
import { Project } from 'app/model/project';
import { Subject } from 'rxjs';
import { ProjectsService } from './projects-service';
import { ProjectForm } from './shared/project-form/project-form';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  imports: [CrudComponent],
})
export class ProjectsComponent {
  private service = inject(ProjectsService);
  private modal = inject(ModalService);

  projects = signal<Project[]>([]);
  isLoading = signal(false);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(25);

  columns: ColumnDefinitionsProps[] = [
    { key: 'status', header: 'Status', type: 'boolean' },
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'start_date', header: 'Data de início', type: 'date' },
    { key: 'end_date', header: 'Data de fim', type: 'date' },
    { key: 'created_at', header: 'Criado em', type: 'datetime' },
    { key: 'updated_at', header: 'Atualizado em', type: 'datetime' },
  ];

  actions: ActionsProps[] = [
    {
      label: 'Editar',
      action: (project: Project) => this.onEdit(project),
      icon: 'edit',
      type: 'default',
    },
    {
      label: 'Excluir',
      action: (project: Project) => this.onDelete(project),
      icon: 'delete',
      type: 'delete',
    },
  ];

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.service.getProjects().subscribe({
      next: (response) => {
        this.projects.set(response.data);
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
      ProjectForm,
      'Adicionar Projeto',
      true,
      true,
      { submitSubject },
      '',
      true,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.service.createProject(result).subscribe(() => this.loadProjects());
      }
    });
  }

  onEdit(project: Project): void {
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
      ProjectForm,
      `Editando: ${project.name}`,
      true,
      true,
      { project, submitSubject },
      '',
      false,
      formActions,
    );

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.service.updateProject(project.id, result).subscribe(() => this.loadProjects());
      }
    });
  }

  onDelete(project: Project): void {
    if (confirm(`Deseja excluir o projeto ${project.name}?`)) {
      this.service.deleteProject(project.id).subscribe(() => this.loadProjects());
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProjects();
  }

  onFilterChange(event: any): void {
    this.pageIndex.set(0);
    this.loadProjects();
  }
}
