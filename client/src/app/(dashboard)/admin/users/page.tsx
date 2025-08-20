'use client';

import { Edit, Trash2 } from 'lucide-react';

import Loading from '@/app/loading';
import ConfirmationModal from '@/components/ConfirmationModal';
import CustomModal from '@/components/CustomDialog';
import { DataTable } from '@/components/DataTable';
import MenuActions from '@/components/DataTable/_components/MenuActions';
import TypeBadge from '@/components/TypeBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Wrapper from '@/components/Wrapper';
import { ColumnDef } from '@tanstack/react-table';
import UserForm from './_components/UserForm';
import useUsers from './_hook/useUsers';

const UsersPage = () => {
  const {
    userStats,
    isModalOpen,
    deleteDialog,
    editingUser,
    users,
    isLoading,
    isSubmitting,
    handleAdd,
    handleDelete,
    handleEdit,
    setIsModalOpen,
  } = useUsers();

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Situação',
      cell: ({ row: { original: user } }) => {
        return <TypeBadge type={user.status} />;
      },
      meta: {
        filterType: 'select',
        data: [
          { label: 'Ativo', value: 'true' },
          { label: 'Inativo', value: 'false' },
        ],
      },
    },
    {
      accessorKey: 'change_password',
      header: 'Alterar Senha',
      cell: ({ row: { original: user } }) => {
        return <TypeBadge type={user.change_password} />;
      },
      meta: {
        filterType: 'select',
        data: [
          { label: 'Sim', value: 'true' },
          { label: 'Não', value: 'false' },
        ],
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ row: { original: user } }) => {
        if (user.created_at) {
          return new Date(user.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
        }
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
      cell: ({ row: { original: user } }) => {
        if (user.updated_at) {
          return new Date(user.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
        }
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row: { original: user } }) => (
        <MenuActions
          actions={[
            {
              label: 'Editar',
              icon: <Edit className="h-4 w-4" />,
              tooltip: 'Editar',
              onClick: () => {
                handleEdit(user.id ?? '');
              },
            },
            {
              label: 'Excluir',
              icon: <Trash2 className="h-4 w-4" />,
              tooltip: 'Excluir',
              color: 'red-500',
              onClick: () => {
                handleDelete(user.id ?? '');
              },
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">Usuários</h1>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalNewUsers}</div>
            <p className="mt-1 text-xs text-green-600">{userStats.totalNewUsersPercentage}% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalUsersActive}</div>
            <p className="mt-1 text-xs text-green-600">{userStats.totalUsersActiviedPercentage}% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Novos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalNewUsers}</div>
            <p className="mt-1 text-xs text-green-600">{userStats.totalNewUsersPercentage}% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <DataTable rows={users} columns={userColumns} isLoading={isSubmitting} addAction={handleAdd} />
      <CustomModal
        title={editingUser ? 'Atualizar usuário' : 'Cadastrar usuário'}
        disableBackdropClick
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <UserForm user={editingUser} />
      </CustomModal>
      <ConfirmationModal
        open={deleteDialog.open}
        title={deleteDialog.title || 'Confirmar exclusão'}
        message={deleteDialog.message || 'Tem certeza que deseja excluir este item?'}
        onConfirm={deleteDialog.onConfirm}
        onClose={deleteDialog.onClose}
        confirmText={deleteDialog.confirmText}
        cancelText={deleteDialog.cancelText}
      />
    </Wrapper>
  );
};

export default UsersPage;
