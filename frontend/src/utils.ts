// src/utils.ts

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
