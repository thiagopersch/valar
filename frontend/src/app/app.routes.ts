// app.routes.ts (sem mudanças, mas confirme que não há duplicatas no array)
import { Routes } from '@angular/router';
import { Navbar } from './components/navbar/navbar'; // Ajuste o import se necessário
import { Profiles } from './pages/private/admin/global-services/profiles/profiles';
import { Modules } from './pages/private/admin/global-services/profiles/shared/modules/modules';
import { Users } from './pages/private/admin/global-services/users/users';
import { Client } from './pages/private/admin/super-admin/client/client';
import { Dashboard } from './pages/private/admin/super-admin/dashboard/dashboard';
import { Login } from './pages/public/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/home', pathMatch: 'full' },
  {
    path: 'login',
    component: Login,
    title: 'Login',
    pathMatch: 'full',
  },
  {
    path: 'educational',
    title: 'Educacional',
    component: Navbar,
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
                component: Dashboard,
                title: 'Alunos',
                data: { icon: 'people' },
                pathMatch: 'full',
              },
              {
                path: 'teachers',
                component: Dashboard,
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
    data: { showInNavbar: true, icon: 'school' },
    children: [],
  },
  {
    path: 'hr',
    title: 'Recursos Humanos',
    component: Navbar,
    data: { showInNavbar: true, icon: 'people' },
    children: [],
  },
  {
    path: 'crm',
    title: 'CRM',
    component: Navbar,
    data: { showInNavbar: true, icon: 'people_outline' },
    children: [],
  },
  {
    path: 'projects',
    title: 'Projetos',
    component: Navbar,
    data: { showInNavbar: true, icon: 'work' },
    children: [],
  },
  {
    path: 'patrimony',
    title: 'Patrimônio',
    component: Navbar,
    data: { showInNavbar: true, icon: 'rocket' },
    children: [],
  },
  {
    path: 'bi',
    title: 'Business Intelligence',
    component: Navbar,
    data: { showInNavbar: true, icon: 'bar_chart' },
    children: [],
  },
  {
    path: 'financial',
    title: 'Financeiro',
    component: Navbar,
    data: { showInNavbar: true, icon: 'payments' },
    children: [
      {
        path: 'payable',
        title: 'Contas a Pagar',
        data: { icon: 'account_balance_wallet' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'receivable',
        title: 'Contas a Receber',
        data: { icon: 'account_balance' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'reconciliation',
        title: 'Conciliação Bancária',
        data: { icon: 'account_balance_wallet' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'budget',
        title: 'Orçamento',
        data: { icon: 'attach_money' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'report',
        title: 'Relatórios Financeiros',
        data: { icon: 'assessment' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'entries',
        title: 'Lançamentos Financeiros',
        data: { icon: 'account_balance_wallet' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'clients-suppliers',
        title: 'Clientes/Fornecedores',
        data: { icon: 'people' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'boletos',
        title: 'Boletos',
        data: { icon: 'receipt_long' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'pix',
        title: 'PIX',
        data: { icon: 'qr_code' },
        component: Dashboard,
        pathMatch: 'full',
      },
      {
        path: 'cards',
        title: 'Cartões',
        data: { icon: 'credit_card' },
        component: Dashboard,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'global-services',
    title: 'Serviços Globais',
    component: Navbar,
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
  {
    path: 'admin',
    title: 'Administração',
    component: Navbar,
    data: { showInNavbar: true, icon: 'settings' },
    children: [
      {
        path: 'home',
        component: Dashboard,
        title: 'Início',
        data: { icon: 'home' },
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
        data: { icon: 'dashboard' },
        pathMatch: 'full',
      },
      {
        path: 'clients',
        component: Client,
        title: 'Clientes',
        data: { icon: 'business' },
        pathMatch: 'full',
      },
    ],
  },
];
