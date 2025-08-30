export const formatDate = (dateString?: string) => {
  if (!dateString) return '';

  const date = new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return date;
};

export const formatDatetime = (dateString?: string) => {
  if (!dateString) return '';

  const date = new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return date;
};
