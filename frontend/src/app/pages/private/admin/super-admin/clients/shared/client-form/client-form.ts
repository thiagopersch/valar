import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormatsPipe } from 'app/components/crud/shared/pipes/formats-pipe';
import { MESSAGES } from 'app/components/toast/messages';
import { ToastService } from 'app/components/toast/toast-service';
import { Client } from 'app/model/client';
import { ServiceActivity } from 'app/model/service-activity';
import { System } from 'app/model/system';
import { User } from 'app/model/user';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { ClientsService } from '../../clients-service';
import { ContractTab } from '../contract-tab/contract-tab';
import { FieldsComplementaryTab } from '../fields-complementary-tab/fields-complementary-tab';
import { HealthTab } from '../health-tab/health-tab';
import { IdentificationTab } from '../identification-tab/identification-tab';
import { ResponsiblesTab } from '../responsibles-tab/responsibles-tab';
import { VisualIdentityTab } from '../visual-identity-tab/visual-identity-tab';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    IdentificationTab,
    VisualIdentityTab,
    ResponsiblesTab,
    ContractTab,
    HealthTab,
    FieldsComplementaryTab,
  ],
})
export class ClientForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private clientService = inject(ClientsService);
  private cdr = inject(ChangeDetectorRef);
  dialogRef = inject<MatDialogRef<ClientForm>>(MatDialogRef, { optional: true });
  data = inject<{ client: Client; submitSubject?: Subject<void> }>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private format = inject(FormatsPipe);
  private submitSub?: Subscription;

  form: FormGroup;
  isEditMode = false;
  loading = false;

  users: User[] = [];
  systems: System[] = [];
  serviceActivities: ServiceActivity[] = [];

  minDate: Date;
  maxDate: Date;

  initialPreviews: Record<string, string | null> = {
    logo: null,
    favicon: null,
    background: null,
  };
  readonly HEALTH_SCORES = [
    { value: 'promoter', label: 'Promotor' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'recovered', label: 'Recuperado' },
    { value: 'attention', label: 'Atenção' },
    { value: 'churn_risk', label: 'Risco de Evasão' },
    { value: 'churned', label: 'Evadido' },
    { value: 'neutral', label: 'Neutro' },
    { value: 'recovering', label: 'Em Recuperação' },
  ];

  readonly IMPLEMENTATION_TYPES = [
    { value: 'technical', label: 'Técnica' },
    { value: 'consultative', label: 'Consultiva' },
    { value: 'check', label: 'Verificar' },
    { value: 'both', label: 'Ambos' },
    { value: 'standard', label: 'Standard' },
    { value: 'on_demand', label: 'On Demand' },
  ];

  readonly ANALYST_TYPES = [
    { value: 'unique', label: 'Único' },
    { value: 'shared', label: 'Compartilhado' },
  ];

  readonly LEVELS = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];

  readonly PRIORITY_LEVELS = [
    { value: 'high', label: 'Alto' },
    { value: 'medium', label: 'Médio' },
    { value: 'low', label: 'Baixo' },
  ];

  readonly DEMAND_LEVELS = [
    { value: 'high', label: 'Alto' },
    { value: 'medium', label: 'Médio' },
    { value: 'low', label: 'Baixo' },
  ];

  constructor() {
    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    this.maxDate = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate());

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      contact_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      url: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/),
        ],
      ],
      status: [true],
      logo: [null],
      favicon: [null],
      background: [null],
      color_primary: ['#000000'],
      contract_start_date: ['', [Validators.required]],
      contract_end_date: [''],
      old_contractual_level: [''],
      contractual_level: ['', [Validators.required]],
      potential_level: ['', [Validators.required]],
      demand_level: ['', [Validators.required]],
      priority_level: ['', [Validators.required]],
      commercial_user_id: ['', [Validators.required]],
      has_dedicated_customer_success: [false],
      customer_success_user_id: [''],
      project_manager_user_id: [''],
      relationship_manager_user_id: [''],
      has_dedicated_analyst: [false],
      dedicated_analyst_user_id: [''],
      analyst_type: [''],
      implementation_type: ['', [Validators.required]],
      general_observations: [''],
      health_score: ['', [Validators.required]],
      systems: [[]],
    });

    this.form.get('has_dedicated_customer_success')?.valueChanges.subscribe((val) => {
      const field = this.form.get('customer_success_user_id');
      if (val) {
        field?.setValidators([Validators.required]);
      } else {
        field?.clearValidators();
        field?.setValue('');
      }
      field?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    if (this.data && this.data.client) {
      this.isEditMode = true;
      const client = this.data.client;

      this.form.patchValue({
        ...client,
        contract_start_date: this.format.parseToLocalDate(client.contract_start_date),
        contract_end_date: this.format.parseToLocalDate(client.contract_end_date),
        commercial_user_id: client.commercial_user?.id ?? client.commercial_user_id,
        customer_success_user_id:
          client.customer_success_user?.id ?? client.customer_success_user_id,
        project_manager_user_id: client.project_manager_user?.id ?? client.project_manager_user_id,
        relationship_manager_user_id:
          client.relationship_manager_user?.id ?? client.relationship_manager_user_id,
        dedicated_analyst_user_id:
          client.dedicated_analyst_user?.id ?? client.dedicated_analyst_user_id,
        systems: client.systems?.map((s: any) => s.id) ?? [],
      });

      this.initialPreviews = {
        logo: client.logo ?? null,
        favicon: client.favicon ?? null,
        background: client.background ?? null,
      };
    }

    this.loadLookups();

    if (this.data?.submitSubject) {
      this.submitSub = this.data?.submitSubject.subscribe(() => this.save());
    }
  }

  ngOnDestroy(): void {
    this.submitSub?.unsubscribe();
  }

  loadLookups(onComplete?: () => void) {
    forkJoin({
      users: this.clientService.getUsers(),
      systems: this.clientService.getSystems(),
    }).subscribe(({ users, systems }) => {
      this.users = users.data ?? [];
      this.systems = systems.data ?? [];
      this.cdr.detectChanges();
      onComplete?.();
    });
  }

  save(): void {
    if (this.form.valid) {
      this.loading = true;
      this.dialogRef?.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.toastService.openWarning(MESSAGES.WARNING);
    }
  }
}
