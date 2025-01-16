export const formatDate = (date: Date | null) => {
  if (!date) return '------';
  
  return new Date(date).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}; 