import { Routes } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AssetManagementDashboard } from './pages/private/admin/asset-management/dashboard/dashboard';
import { HeritageGroups } from './pages/private/admin/asset-management/heritage-groups/heritage-groups';
import { Heritage } from './pages/private/admin/asset-management/heritage/heritage';
import { Bi } from './pages/private/admin/bi/bi';
import { Churches } from './pages/private/admin/church/churches/churches';
import { ChurchDashboard } from './pages/private/admin/church/dashboard/dashboard';
import { EventTypes } from './pages/private/admin/church/event-types/event-types';
import { Events } from './pages/private/admin/church/events/events';
import { Guests } from './pages/private/admin/church/guests/guests';
import { MemberOrigin } from './pages/private/admin/church/member-origin/member-origin';
import { Members } from './pages/private/admin/church/members/members';
import { MinisterialPosition } from './pages/private/admin/church/ministerial-position/ministerial-position';
import { Contacts } from './pages/private/admin/crm/contacts/contacts';
import { CrmDashboard } from './pages/private/admin/crm/dashboard/dashboard';
import { Services } from './pages/private/admin/crm/services/services';
import { Workflow } from './pages/private/admin/crm/workflow/workflow';
import { Students } from './pages/private/admin/educational/educational/students-teachers/students/students';
import { Teachers } from './pages/private/admin/educational/educational/students-teachers/teachers/teachers';
import { Boletos } from './pages/private/admin/financial-management/accounts-payable-receivable/boletos/boletos';
import { Cards } from './pages/private/admin/financial-management/accounts-payable-receivable/cards/cards';
import { Pix } from './pages/private/admin/financial-management/accounts-payable-receivable/pix/pix';
import { Transactions } from './pages/private/admin/financial-management/accounts-payable-receivable/transactions/transactions';
import { Budget } from './pages/private/admin/financial-management/bank-transactions/budget/budget';
import { Reconciliation } from './pages/private/admin/financial-management/bank-transactions/reconciliation/reconciliation';
import { ClientsSuppliers } from './pages/private/admin/financial-management/registers/clients-suppliers/clients-suppliers';
import { TransactionCategories } from './pages/private/admin/financial-management/registers/transaction-categories/transaction-categories';
import { Profiles } from './pages/private/admin/global-services/profiles/profiles';
import { Modules } from './pages/private/admin/global-services/profiles/shared/modules/modules';
import { Users } from './pages/private/admin/global-services/users/users';
import { Bonuses } from './pages/private/admin/hr/bonuses/bonuses';
import { BossesAndSupervisors } from './pages/private/admin/hr/bosses-and-supervisors/bosses-and-supervisors';
import { HrDashboard } from './pages/private/admin/hr/dashboard/dashboard';
import { Employees } from './pages/private/admin/hr/employees/employees';
import { WorkSchedules } from './pages/private/admin/hr/work-schedules/work-schedules';
import { ProjectsComponent } from './pages/private/admin/project-management/projects/projects';
import { ClientsComponent } from './pages/private/admin/super-admin/clients/clients';
import { Dashboard } from './pages/private/admin/super-admin/dashboard/dashboard';
import { Systems } from './pages/private/admin/super-admin/systems/systems';
import { Login } from './pages/public/login/login';
import { authGuard, guestGuard } from './services/auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: Login,
    title: 'Login',
    pathMatch: 'full',
    canActivate: [guestGuard],
  },
  {
    path: 'super-admin',
    title: 'Super Admin',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'settings' },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        pathMatch: 'full',
      },
      {
        path: 'clients',
        component: ClientsComponent,
        title: 'Clientes',
        data: { icon: 'business' },
        pathMatch: 'full',
      },
      {
        path: 'systems',
        component: Systems,
        title: 'Sistemas',
        data: { icon: 'apps' },
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'educational',
    title: 'Educacional',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'school' },
    children: [
      {
        path: '',
        children: [
          {
            path: 'students-teachers',
            title: 'Alunos/Professores',
            data: { icon: 'groups' },
            children: [
              {
                path: 'students',
                component: Students,
                title: 'Alunos',
                data: { icon: 'people' },
                pathMatch: 'full',
              },
              {
                path: 'teachers',
                component: Teachers,
                title: 'Professores',
                data: { icon: 'person' },
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'curriculum-structure',
            title: 'Estrutura curricular',
            data: { icon: 'groups' },
            children: [
              {
                path: 'courses',
                component: Dashboard,
                title: 'Cursos',
                data: { icon: 'school' },
                pathMatch: 'full',
              },
              {
                path: 'curriculum-matrices',
                component: Dashboard,
                title: 'Matrizes Curriculares',
                data: { icon: 'school' },
                pathMatch: 'full',
              },
              {
                path: 'curriculum-structures',
                component: Dashboard,
                title: 'Estruturas Curriculares',
                data: { icon: 'school' },
                pathMatch: 'full',
              },
              {
                path: 'subjects',
                component: Dashboard,
                title: 'Disciplinas',
                data: { icon: 'school' },
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'offers',
            title: 'Ofertas',
            data: { icon: 'school' },
            children: [
              {
                path: 'academic-period',
                component: Dashboard,
                title: 'Período Acadêmico',
                data: { icon: 'calendar_today' },
                pathMatch: 'full',
              },
              {
                path: 'classes',
                component: Dashboard,
                title: 'Turmas',
                data: { icon: 'class' },
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'registration-evaluation',
            title: 'Matrículas e Avaliação',
            data: { icon: 'check_circle' },
            children: [
              {
                path: 'enrrolments',
                component: Dashboard,
                title: 'Matrículas',
                data: { icon: 'assignment_ind' },
                pathMatch: 'full',
              },
              {
                path: 're-enrrolments',
                component: Dashboard,
                title: 'Renovação de matrículas',
                data: { icon: 'assignment_return' },
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'financial-accounting',
            title: 'Financeiro / Contábil',
            data: { icon: 'account_balance' },
            children: [
              {
                path: 'payment-plans',
                component: Dashboard,
                title: 'Planos de Pagamento',
                data: { icon: 'payment' },
                pathMatch: 'full',
              },
              {
                path: 'scholarships',
                component: Dashboard,
                title: 'Bolsas',
                data: { icon: 'school' },
                pathMatch: 'full',
              },
              {
                path: 'contracts',
                component: Dashboard,
                title: 'Contratos',
                data: { icon: 'description' },
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'selective-process',
        title: 'Processo Seletivo',
        data: { icon: 'checklist' },
        children: [],
      },
      {
        path: 'evaluation-research',
        title: 'Avaliação e Pesquisa',
        data: { icon: 'assessment' },
        children: [],
      },
      {
        path: 'library',
        title: 'Biblioteca',
        data: { icon: 'menu_book' },
        children: [],
      },
    ],
  },
  {
    path: 'church',
    title: 'Igreja',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'school' },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: ChurchDashboard,
            title: 'Dashboard',
            data: { icon: 'dashboard' },
            pathMatch: 'full',
          },
          {
            path: 'churches',
            component: Churches,
            title: 'Igrejas',
            data: { icon: 'church' },
            pathMatch: 'full',
          },
          {
            path: 'event-types',
            component: EventTypes,
            title: 'Tipos de Eventos',
            data: { icon: 'event' },
            pathMatch: 'full',
          },
          {
            path: 'member-origin',
            component: MemberOrigin,
            title: 'Origem de Membros',
            data: { icon: 'person_add' },
            pathMatch: 'full',
          },
          {
            path: 'ministerial-position',
            component: MinisterialPosition,
            title: 'Posição Ministerial',
            data: { icon: 'work' },
            pathMatch: 'full',
          },
          {
            path: 'members',
            component: Members,
            title: 'Membros',
            data: { icon: 'people' },
            pathMatch: 'full',
          },
          {
            path: 'events',
            component: Events,
            title: 'Eventos',
            data: { icon: 'events' },
            pathMatch: 'full',
          },
          {
            path: 'guests',
            component: Guests,
            title: 'Convidados',
            data: { icon: 'people' },
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  {
    path: 'hr',
    title: 'Recursos Humanos',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'people' },
    children: [
      {
        path: 'dashboard',
        component: HrDashboard,
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        pathMatch: 'full',
      },
      {
        path: 'employees',
        component: Employees,
        title: 'Funcionários',
        data: { icon: 'people' },
        pathMatch: 'full',
      },
      {
        path: 'bosses-and-supervisors',
        component: BossesAndSupervisors,
        title: 'Chefes e Supervisores',
        data: { icon: 'people' },
        pathMatch: 'full',
      },
      {
        path: 'bonuses',
        component: Bonuses,
        title: 'Bônus',
        data: { icon: 'people' },
        pathMatch: 'full',
      },
      {
        path: 'work-schedules',
        component: WorkSchedules,
        title: 'Horários de Trabalho',
        data: { icon: 'people' },
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'crm',
    title: 'CRM',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'people_outline' },
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        component: CrmDashboard,
        pathMatch: 'full',
      },
      {
        path: 'contacts',
        title: 'Contatos',
        data: { icon: 'people' },
        component: Contacts,
        pathMatch: 'full',
      },
      {
        path: 'services',
        title: 'Serviços',
        data: { icon: 'work' },
        component: Services,
        pathMatch: 'full',
      },
      {
        path: 'workflow',
        title: 'Workflow',
        data: { iconSvg: '/icons/automation.svg' },
        component: Workflow,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'projects',
    title: 'Gestão de Projetos',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'work' },
    children: [
      {
        path: 'project',
        title: 'Projetos',
        component: ProjectsComponent,
        data: { icon: 'rocket_launch' },
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'asset-management',
    title: 'Gestão de Patrimônial',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'inventory' },
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        component: AssetManagementDashboard,
        pathMatch: 'full',
      },
      {
        path: 'heritage-groups',
        title: 'Grupos de patrimônio',
        data: { icon: 'folder' },
        component: HeritageGroups,
        pathMatch: 'full',
      },
      {
        path: 'heritage',
        title: 'Patrimônio',
        data: { icon: 'inventory' },
        component: Heritage,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'financial-management',
    title: 'Gestão Financeira',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'payments' },
    children: [
      {
        path: '',
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'registers',
        title: 'Cadastros',
        data: { icon: 'list' },
        children: [
          {
            path: 'clients-suppliers',
            title: 'Clientes/Fornecedores',
            data: { icon: 'people' },
            component: ClientsSuppliers,
            pathMatch: 'full',
          },
          {
            path: 'transaction-categories',
            title: 'Categorias de transações',
            data: { icon: 'category' },
            component: TransactionCategories,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'payable-receivable',
        title: 'Contas a Pagar/Receber',
        data: { icon: 'account_balance' },
        children: [
          {
            path: 'transactions',
            title: 'Transações/Lançamentos',
            component: Transactions,
            data: { icon: 'paid' },
            pathMatch: 'full',
          },
          {
            path: 'boletos',
            title: 'Boletos',
            component: Boletos,
            data: { icon: 'receipt_long' },
            pathMatch: 'full',
          },
          {
            path: 'pix',
            title: 'PIX',
            component: Pix,
            data: { icon: 'qr_code' },
            pathMatch: 'full',
          },
          {
            path: 'cards',
            title: 'Cartões',
            component: Cards,
            data: { icon: 'credit_card' },
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'bank-transactions',
        title: 'Movimentações Bancárias',
        data: { icon: 'account_balance' },
        children: [
          {
            path: 'reconciliation',
            title: 'Conciliação Bancária',
            data: { icon: 'account_balance_wallet' },
            component: Reconciliation,
            pathMatch: 'full',
          },
          {
            path: 'budget',
            title: 'Orçamento',
            data: { icon: 'attach_money' },
            component: Budget,
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  {
    path: 'bi',
    title: 'Business Intelligence',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'bar_chart' },
    children: [
      {
        path: '',
        component: Bi,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'global-services',
    title: 'Serviços Globais',
    component: Navbar,
    canActivate: [authGuard],
    data: { showInNavbar: true, icon: 'settings' },
    children: [
      {
        path: 'users',
        component: Users,
        title: 'Usuários',
        data: { icon: 'people' },
        pathMatch: 'full',
      },
      {
        path: 'profiles',
        component: Profiles,
        title: 'Perfis',
        data: { icon: 'badge' },
        pathMatch: 'full',
      },
      {
        path: 'modules',
        component: Modules,
        title: 'Módulos',
        data: { icon: 'view_module' },
        pathMatch: 'full',
      },
    ],
  },
];
