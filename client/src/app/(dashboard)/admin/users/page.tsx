'use client';

import Loading from '@/app/loading';
import ConfirmationModal from '@/components/ConfirmationModal';
import CustomModal from '@/components/CustomDialog';
import { DataTable } from '@/components/DataTable';
import MenuActions from '@/components/DataTable/_components/MenuActions';
import TypeBadge from '@/components/TypeBadge';
import Wrapper from '@/components/Wrapper';
import { formatDatetime } from '@/pipes/formatDate';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import CardStatistics from './_components/CardStatistics';
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
      cell: ({ row: { original: user } }) => <TypeBadge type={user.status} label={user.status ? 'Ativo' : 'Inativo'} />,
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
      cell: ({ row: { original: user } }) => (
        <TypeBadge type={user.change_password} label={user.change_password ? 'Sim' : 'Não'} />
      ),
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
      cell: ({ row: { original: user } }) => formatDatetime(user.created_at),
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
      cell: ({ row: { original: user } }) => formatDatetime(user.updated_at),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original: user } }) => {
        if (!user) {
          return null;
        }

        return (
          <MenuActions
            actions={[
              {
                label: 'Editar',
                icon: <Edit className="h-4 w-4" />,
                tooltip: 'Editar',
                onClick: () => {
                  handleEdit(user.id);
                },
              },
              {
                label: 'Excluir',
                icon: <Trash2 className="h-4 w-4" />,
                tooltip: 'Excluir',
                color: 'red-500',
                onClick: () => {
                  handleDelete(user.id);
                },
              },
            ]}
          />
        );
      },
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
        <CardStatistics
          title="Total de Usuários"
          value={userStats.totalUsers}
          percentage={userStats.totalNewUsersPercentage}
        />
        <CardStatistics
          title="Usuários Ativos"
          value={userStats.totalUsersActive}
          percentage={userStats.totalUsersActiviedPercentage}
        />
        <CardStatistics
          title="Novos Usuários"
          value={userStats.totalNewUsers}
          percentage={userStats.totalNewUsersPercentage}
        />
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
