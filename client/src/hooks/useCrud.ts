import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type CrudOptions<T, TCreate, TUpdate> = {
  queryKey: string[];
  listFn: () => Promise<T[]>;
  getFn: (id: string) => Promise<T>;
  createFn: (data: TCreate) => Promise<T>;
  updateFn: (id: string, data: TUpdate) => Promise<T>;
  deleteFn: (id: string) => Promise<boolean>;
  deleteConfirmation: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
  queryOptions?: {
    enabled?: boolean;
    staleTime?: number;
    onSuccess?: () => void;
  };
};

export default function useCrud<T, TCreate = T, TUpdate = T>({
  queryKey,
  listFn,
  getFn,
  createFn,
  updateFn,
  deleteFn,
  deleteConfirmation = {
    title: 'Atenção',
    message: 'Você tem certeza que deseja excluir esse cadastro?',
    confirmText: 'Sim',
    cancelText: 'Cancelar',
  },
  queryOptions = {},
}: CrudOptions<T, TCreate, TUpdate>) {
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await listFn();
      return result.filter((item) => item !== null && item !== undefined);
    },
    staleTime: queryOptions.staleTime || 5 * 60 * 1000,
    enabled: queryOptions.enabled !== undefined ? queryOptions.enabled : true,
  });
  const items = data || [];

  const createMutation = useMutation({
    mutationFn: (payload: TCreate) => {
      return createFn(payload);
    },
    onSuccess: () => {
      toast.success('Cadastro feito com sucesso!');
      queryClient.invalidateQueries({ queryKey });
      queryOptions.onSuccess?.();
    },
    onError: (error: AxiosError | any) => {
      if (error.response?.status === 400 && error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];
        messages.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(`Falha ao criar o cadastro: ${error?.response?.data?.message || error.message}`, {
          richColors: true,
          closeButton: true,
          duration: 5000,
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdate }) => updateFn(id, data),
    onSuccess: () => {
      toast.success('Cadastro atualizado com sucesso!', {
        richColors: true,
        closeButton: true,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey });
      queryOptions.onSuccess?.();
    },
    onError: (error: AxiosError | any) => {
      if (error.response?.status === 400 && error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];
        messages.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(`Falha ao atualizar o cadastro: ${error?.response?.data?.message || error.message}`, {
          richColors: true,
          closeButton: true,
          duration: 5000,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success('Cadastro excluído com sucesso!', {
        richColors: true,
        closeButton: true,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey });
      queryOptions.onSuccess?.();
    },
    onError: (error: AxiosError | any) => {
      toast.error(`Falha ao excluir o cadastro: ${error.message}`, {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });
    },
  });

  const fetchById = async (id: string) => {
    try {
      const item = await getFn(id);
      return item;
    } catch (error: any) {
      toast.error(`Falha ao carregar o cadastro: ${error.message}`, {
        richColors: true,
        closeButton: true,
        duration: 5000,
      });
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: TUpdate) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await deleteMutation.mutateAsync(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  return {
    items,
    isLoading,
    create: createMutation.mutateAsync,
    handleUpdate,
    remove: handleDelete,
    fetchById,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    deleteDialog: {
      open: deleteDialog.open,
      title: deleteConfirmation.title,
      message: deleteConfirmation.message,
      confirmText: deleteConfirmation.confirmText,
      cancelText: deleteConfirmation.cancelText,
      onConfirm: confirmDelete,
      onClose: closeDeleteDialog,
    },
  };
}
