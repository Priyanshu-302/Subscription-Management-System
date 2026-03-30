import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString, template = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  return format(new Date(dateString), template);
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
