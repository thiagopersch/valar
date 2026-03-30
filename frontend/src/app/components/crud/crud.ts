import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  Pipe,
  PipeTransform,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth/auth-service';
import { ModalService } from '../modal/modal-service';
import { ActionsProps, ColumnDefinitionsProps, TableField } from './interfaces';
import { BadgeTypeComponent } from './shared/components/badge-type/badge-type.component';
import {
  FilterButtonAdvancedComponent,
  FilterField,
} from './shared/components/filter-advanced/filter-advanced';
import { FormatValuesPipe } from './shared/pipes/format-values-pipe';
import { FormatsPipe } from './shared/pipes/formats-pipe';

@Pipe({ name: 'hasNonToggleActions' })
export class HasNonToggleActionsPipe implements PipeTransform {
  transform(actions: ActionsProps[] | undefined | null): boolean {
    return actions ? actions.some((action) => action.type !== 'toggle') : false;
  }
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.html',
  styleUrl: './crud.css',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    FormatValuesPipe,
    HasNonToggleActionsPipe,
    FilterButtonAdvancedComponent,
    BadgeTypeComponent,
  ],
  providers: [FormatsPipe],
})
export class CrudComponent implements AfterViewInit {
  private format = inject(FormatsPipe);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  fields = input<TableField[]>([]);
  ctaLabel = input('Adicionar');
  columnDefinitions = input<ColumnDefinitionsProps[]>([]);
  enableFilterAdvanced = input(false);
  enablePagination = input(true);
  enableToggleStatus = input(false);
  enableAddButtonAdd = input(true);
  enableRowClickDialog = input(false);
  tooltipText = input('');
  length = input(0);
  pageSize = input(25);
  pageSizeOptions = input([25, 50, 100, 200]);
  pageIndex = input(0);
  template = input('');
  sortColumn = input('');
  sortDirection = input<SortDirection>('asc');
  isTooltip = input(false);
  isLoading = input(false);
  filterFields = input<FilterField[]>([]);
  actions = input<ActionsProps[]>();
  dataSourceMat = input(new MatTableDataSource<any>([]));
  modalTitle = input('Detalhes do Registro');
  modalComponent = input<Type<any> | null>(null);
  findDataLabel = input('Atualizar');
  showFindDataButton = input(false);
  readPermission = input<string | undefined>(undefined);
  writePermission = input<string | undefined>(undefined);
  deletePermission = input<string | undefined>(undefined);

  actionEvent = output<any>();
  add = output<void>();
  edit = output<any>();
  delete = output<any>();
  toggle = output<any>();
  findData = output<void>();
  page = output<PageEvent>();

  displayedColumns = signal<string[]>([]);
  currentPageIndex = signal(0);
  showFilter = signal(false);
  buttonSelected = signal(false);

  private _canRead = computed(() => {
    const perm = this.readPermission();
    return perm ? this.authService.hasPermission(perm) : true;
  });

  private _canWrite = computed(() => {
    const perm = this.writePermission();
    return perm ? this.authService.hasPermission(perm) : true;
  });

  private _canDelete = computed(() => {
    const perm = this.deletePermission();
    return perm ? this.authService.hasPermission(perm) : true;
  });

  canAddOrEdit = this._canWrite;
  canDeleteRow = this._canDelete;
  canRead = this._canRead;

  canShowActions = computed(() => {
    const actions = this.actions();
    if (!actions || actions.length === 0) {
      return false;
    }

    const hasToggleAction = actions.some((action) => action.type === 'toggle');
    const hasPermission = this._canRead() || this._canWrite() || this._canDelete();

    return hasToggleAction || hasPermission;
  });

  tooltipLabel = computed(() => {
    const actions = this.actions();
    return actions && actions.length > 0 ? actions[0].tooltip : '';
  });

  constructor() {
    effect(() => {
      this.dataSourceMat().data = this.fields();
    });

    effect(() => {
      const paginator = this.paginator();
      if (paginator) {
        this.dataSourceMat().paginator = paginator;
        paginator.length = this.fields().length;
        paginator.pageIndex = this.pageIndex();
      }
    });

    effect(() => {
      // Update displayed columns
      const cols = this.columnDefinitions().map((col) => col.key);
      if (this.canShowActions()) {
        cols.push('actions');
      }
      this.displayedColumns.set(cols);
    });

    effect(() => {
      // Initialize filter predicate
      this.dataSourceMat().filterPredicate = this.createFilter();
    });

    effect(() => {
      const sort = this.sort();
      if (sort) {
        this.dataSourceMat().sort = sort;
      }
    });
  }

  ngAfterViewInit() {
    const paginator = this.paginator();
    if (paginator) {
      paginator.pageIndex = this.currentPageIndex();
      paginator.page.subscribe((event) => {
        this.currentPageIndex.set(paginator.pageIndex);
        this.page.emit(event);
      });
    }

    this.dataSourceMat().sortingDataAccessor = (item, property) => {
      const value = this.format.getNestedValue(item, property);
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        return this.normalizeString(value);
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
      if (value instanceof Date) {
        return value.getTime();
      }
      return value;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSourceMat().filterPredicate = this.createFilter();
    this.dataSourceMat().filter = filterValue;

    if (this.dataSourceMat().paginator) {
      this.dataSourceMat().paginator!.firstPage();
    }
  }

  applyAdvancedFilter(values: any) {
    if (Object.keys(values).length === 0) {
      this.dataSourceMat().filter = '';
      this.dataSourceMat().filterPredicate = this.createFilter();
      this.dataSourceMat().data = this.fields();
      if (this.dataSourceMat().paginator) {
        this.dataSourceMat().paginator!.firstPage();
      }
      return;
    }

    this.dataSourceMat().filterPredicate = this.createFilter(values);
    this.dataSourceMat().filter = JSON.stringify(values);

    if (this.dataSourceMat().paginator) {
      this.dataSourceMat().paginator!.firstPage();
    }
  }

  private createFilter(_filterValues: any = {}): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      if (!filter) {
        return true;
      }

      if (!filter.startsWith('{')) {
        const searchText = filter.toLowerCase();
        return this.columnDefinitions().some((col) => {
          const value = this.format.getNestedValue(data, col.key);
          return value != null && value.toString().toLowerCase().includes(searchText);
        });
      }

      let parsedFilterValues: any = {};
      try {
        parsedFilterValues = JSON.parse(filter);
      } catch (e) {
        console.error('Erro ao analisar filtro JSON:', e);
        return true;
      }

      if (Object.keys(parsedFilterValues).length === 0) {
        return true;
      }

      return Object.keys(parsedFilterValues).every((key) => {
        const filterValue = parsedFilterValues[key];
        const dataValue = this.format.getNestedValue(data, key);

        if (filterValue == null || dataValue == null) {
          return true;
        }

        const field = this.filterFields().find((f) => f.controlName === key);
        const fieldType = field?.type || 'text';

        switch (fieldType) {
          case 'select':
            if (Array.isArray(filterValue)) {
              return filterValue.length === 0 || filterValue.includes(dataValue);
            }
            return filterValue === dataValue;
          case 'text':
            return (
              filterValue.length === 0 ||
              String(dataValue).toLowerCase().includes(String(filterValue).toLowerCase())
            );
          case 'number':
            if (Array.isArray(filterValue)) {
              return filterValue.length === 0 || filterValue.includes(Number(dataValue));
            }
            return Number(dataValue) === Number(filterValue);
          case 'boolean':
            if (Array.isArray(filterValue)) {
              return filterValue.length === 0 || filterValue.includes(Boolean(dataValue));
            }
            return Boolean(dataValue) === Boolean(filterValue);
          case 'date':
            return new Date(dataValue).toDateString() === new Date(filterValue).toDateString();
          case 'dateRange':
            return true;
          case 'range':
            return Number(dataValue) >= Number(filterValue);
          default:
            return true;
        }
      });
    };
  }

  openRowDialog(row: any): void {
    const component = this.modalComponent();
    if (this.enableRowClickDialog() && component) {
      this.modalService.openModal(
        `modal-${Math.random()}`,
        component,
        this.modalTitle(),
        false,
        true,
        {
          logCenter: row,
        },
        'custom-modal',
        true,
      );
    }
  }

  toggleFilter() {
    this.showFilter.update((value) => !value);
    this.buttonSelected.update((prev) => !prev);
  }

  action(element: any) {
    this.actionEvent.emit(element);
  }

  private normalizeString(value: any): string {
    return String(value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  checkVisible(action: ActionsProps, fields: any): boolean {
    if (action.visible === undefined) {
      return true;
    }
    if (typeof action.visible === 'function') {
      return action.visible(fields);
    }
    return action.visible;
  }
}
