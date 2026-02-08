import useCrud from '@/hooks/useCrud';
import { createUser, deleteUser, getUser, listUsers, updateUser } from '@/lib/services/admin/users';
import useUserStore from '@/stores/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserFormData, userSchema } from './schema';

export interface DashboardStats {
  totalUsers: number;
  totalUsersActive: number;
  totalNewUsers: number;
  totalUsersActiviedPercentage: number;
  totalUsersPercentage: number;
  totalNewUsersPercentage: number;
}

export interface ChurchStats {
  totalChurches: number;
  totalChurchPercentage: number;
  totalNewChurches: number;
  totalNewChurchPercentage: number;
}

export default function useUsers() {
  const { isModalOpen, editingUser, showPassword, setIsModalOpen, setEditingUser, toggleShowPassword } = useUserStore();
  const {
    items: users,
    isLoading,
    create,
    handleUpdate,
    remove,
    fetchById,
    isCreating,
    isUpdating,
    isDeleting,
    deleteDialog,
  } = useCrud<User, User, User>({
    queryKey: ['listUsers'],
    listFn: listUsers,
    getFn: getUser,
    createFn: createUser,
    updateFn: updateUser,
    deleteFn: deleteUser,
    deleteConfirmation: {
      title: 'Atenção - Exclusão de Usuário',
      message: 'Você tem certeza que deseja excluir este usuário? Esta ação é irreversível.',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
    },
  });

  const form = useForm<UserFormData>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      change_password: true,
      status: true,
      enable_password: false,
    },
  });

  useEffect(() => {
    if (editingUser) {
      form.reset({
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        change_password: editingUser.change_password,
        status: editingUser.status,
        enable_password: false,
      });
    } else {
      form.reset({
        id: '',
        name: '',
        email: '',
        password: '',
        change_password: true,
        status: true,
        enable_password: true,
      });
    }
  }, [editingUser, form.reset]);

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    if (editingUser && editingUser.id) {
      const updatedData = {
        id: editingUser.id,
        name: data.name,
        email: data.email,
        password: data.enable_password ? data.password : undefined,
        change_password: data.change_password,
        status: data.status,
      };
      await handleUpdate(editingUser.id, updatedData);
      setIsModalOpen(false);
      setEditingUser(null);
    } else {
      const { id, enable_password, ...newUserData } = data;
      await create(newUserData);
      form.reset({
        id: '',
        name: '',
        email: '',
        password: '',
        change_password: true,
        status: true,
        enable_password: true,
      });
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsModalOpen(false);
    form.clearErrors();
    form.reset();
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    const user = await fetchById(id);
    if (user) {
      setEditingUser(user);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const calculateUserStats = (users: User[]): DashboardStats => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const totalUsers = users.length;
    const totalUsersActive = users.filter((user) => user.status).length;
    const totalUsersActiviedPercentage = parseFloat(((totalUsersActive / totalUsers) * 100).toFixed(2)) || 0;

    const totalNewUsers = users.filter((user) => {
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      return createdAt && createdAt >= startOfCurrentMonth && createdAt <= endOfCurrentMonth;
    }).length;

    const previousMonthUsers = users.filter((user) => {
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      return createdAt && createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    }).length;

    const totalNewUsersPercentage =
      previousMonthUsers > 0
        ? parseFloat((((totalNewUsers - previousMonthUsers) / previousMonthUsers) * 100).toFixed(2))
        : 0;

    const previousTotalUsers = users.filter((user) => {
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      return createdAt && createdAt <= endOfPreviousMonth;
    }).length;

    const totalUsersPercentage =
      previousTotalUsers > 0
        ? parseFloat((((totalUsers - previousTotalUsers) / previousTotalUsers) * 100).toFixed(2))
        : 0;

    return {
      totalUsers,
      totalUsersActive,
      totalNewUsers,
      totalUsersActiviedPercentage,
      totalUsersPercentage,
      totalNewUsersPercentage,
    };
  };

  const userStats: DashboardStats = useMemo(() => calculateUserStats(users), [users]);

  return {
    users,
    isModalOpen,
    editingUser,
    userStats,
    isSubmitting: form.formState.isSubmitting || isCreating || isUpdating || isDeleting,
    showPassword,
    isLoading,
    form,
    deleteDialog,
    Controller,
    setIsModalOpen,
    handleAdd,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSubmit: form.handleSubmit(onSubmit),
    handleClickShowPassword: toggleShowPassword,
    handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
  };
}
