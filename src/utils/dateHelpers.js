export const isDelayedWindowOpen = (completedAt) => {
  const now = Date.now();
  const start = new Date(completedAt).getTime() + 48 * 60 * 60 * 1000;
  const end = new Date(completedAt).getTime() + 72 * 60 * 60 * 1000;
  return now >= start && now <= end;
};
