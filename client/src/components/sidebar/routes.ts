import {
  BookOpen,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  GraduationCap,
  Home,
  Library,
  MessageSquare,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { ReactNode } from 'react';

type RouteItems = {
  title: string;
  url: string;
};

type Route = {
  title: string;
  url?: string;
  icon?: ReactNode | any;
  items?: RouteItems[];
};

const menuItems: Route[] = [
  {
    title: 'Dashboard',
    icon: Home,
    url: '/dashboard',
  },
  {
    title: 'Administrativo',
    icon: Settings,
    items: [
      { title: 'Usuários', url: '/admin/users' },
      { title: 'Perfis', url: '/admin/roles' },
      { title: 'Permissões', url: '/admin/permissions' },
      { title: 'Módulos', url: '/admin/modules' },
    ],
  },
  {
    title: 'Gestão Financeira',
    icon: DollarSign,
    items: [
      { title: 'Contas a Pagar', url: '/financial/payable' },
      { title: 'Contas a Receber', url: '/financial/receivable' },
      { title: 'Conciliação Bancária', url: '/financial/reconciliation' },
      { title: 'Orçamento', url: '/financial/budget' },
      { title: 'Relatórios', url: '/financial/reports' },
      { title: 'Lançamentos', url: '/financial/entries' },
      { title: 'Clientes/Fornecedores', url: '/financial/contacts' },
      { title: 'Boletos', url: '/financial/boletos' },
      { title: 'PIX', url: '/financial/pix' },
      { title: 'Cartão', url: '/financial/cards' },
    ],
  },
  {
    title: 'Educacional',
    icon: GraduationCap,
    items: [
      { title: 'Alunos', url: '/education/students' },
      { title: 'Professores', url: '/education/teachers' },
      { title: 'Períodos Letivos', url: '/education/school_terms' },
      { title: 'Cursos', url: '/education/courses' },
      { title: 'Planos de Pagamento', url: '/education/payment-plans' },
      { title: 'Bolsas', url: '/education/scholarships' },
      { title: 'Contratos', url: '/education/contracts' },
      { title: 'Turmas', url: '/education/classes' },
      { title: 'Matrículas', url: '/education/enrollments' },
      { title: 'Rematrículas', url: '/education/re-enrollments' },
    ],
  },
  {
    title: 'Processo Seletivo',
    icon: FileText,
    items: [
      { title: 'Cursos Ofertados', url: '/selection/courses' },
      { title: 'Processos Seletivos', url: '/selection/processes' },
      { title: 'Agendamentos', url: '/selection/schedules' },
      { title: 'Candidatos', url: '/selection/candidates' },
      { title: 'Locais de Ofertas', url: '/selection/locations' },
      { title: 'Classificação', url: '/selection/classification' },
    ],
  },
  {
    title: 'Avaliação e Pesquisa',
    icon: BookOpen,
    items: [
      { title: 'Categorias', url: '/assessment/categories' },
      { title: 'Provas', url: '/assessment/exams' },
      { title: 'Questões', url: '/assessment/questions' },
      { title: 'Dashboard', url: '/assessment/dashboard' },
    ],
  },
  {
    title: 'Gestão de Igreja',
    icon: Building2,
    items: [
      { title: 'Pessoas', url: '/church/people' },
      { title: 'Igrejas', url: '/church/churches' },
      { title: 'Tipos de Eventos', url: '/church/event-types' },
      { title: 'Ordenações', url: '/church/ordinations' },
      { title: 'Membros', url: '/church/members' },
      { title: 'Eventos', url: '/church/events' },
    ],
  },
  {
    title: 'Gestão de Pessoas (RH)',
    icon: Users,
    items: [
      { title: 'Folha de Pagamento', url: '/hr/payroll' },
      { title: 'Controle de Ponto', url: '/hr/attendance' },
      { title: 'Férias e Ausências', url: '/hr/vacations' },
      { title: 'Treinamentos', url: '/hr/training' },
      { title: 'Avaliação de Desempenho', url: '/hr/performance' },
    ],
  },
  {
    title: 'CRM',
    icon: MessageSquare,
    items: [
      { title: 'Contextualização', url: '/crm/context' },
      { title: 'Gestão de Alunos', url: '/crm/students' },
      { title: 'Pipeline de Vendas', url: '/crm/pipeline' },
      { title: 'Gestão de Clientes', url: '/crm/clients' },
      { title: 'Cotações e Pedidos', url: '/crm/quotes' },
      { title: 'Comissões', url: '/crm/commissions' },
      { title: 'Pós-Venda', url: '/crm/support' },
      { title: 'Dashboard', url: '/crm/dashboard' },
    ],
  },
  {
    title: 'Compras e Suprimentos',
    icon: ShoppingCart,
    items: [
      { title: 'Cotações', url: '/procurement/quotes' },
      { title: 'Pedidos de Compra', url: '/procurement/orders' },
      { title: 'Fornecedores', url: '/procurement/suppliers' },
      { title: 'Cantina/Alimentação', url: '/procurement/cafeteria' },
    ],
  },
  {
    title: 'Gestão de Projetos',
    icon: Calendar,
    items: [
      { title: 'Projetos', url: '/projects/list' },
      { title: 'Recursos', url: '/projects/resources' },
      { title: 'Timesheets', url: '/projects/timesheets' },
      { title: 'Kanban', url: '/projects/kanban' },
    ],
  },
  {
    title: 'Patrimônio e Ativos',
    icon: Package,
    items: [
      { title: 'Inventário', url: '/assets/inventory' },
      { title: 'Manutenção', url: '/assets/maintenance' },
      { title: 'Depreciação', url: '/assets/depreciation' },
    ],
  },
  {
    title: 'Business Intelligence',
    icon: PieChart,
    items: [
      { title: 'Análise de Dados', url: '/bi/analysis' },
      { title: 'Dashboards', url: '/bi/dashboards' },
      { title: 'Alertas', url: '/bi/alerts' },
    ],
  },
  {
    title: 'Biblioteca',
    icon: Library,
    items: [
      { title: 'Acervo', url: '/library/collection' },
      { title: 'Empréstimos', url: '/library/loans' },
      { title: 'Devoluções', url: '/library/returns' },
      { title: 'Multas', url: '/library/fines' },
    ],
  },
];

export { menuItems };
