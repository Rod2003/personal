export type ViewMode = 'terminal' | 'classic';

export const VIEW_STORAGE_KEY = 'rodrodrod-view';

export const isViewMode = (value: unknown): value is ViewMode =>
  value === 'terminal' || value === 'classic';

export const resolveViewMode = (query: unknown, stored: unknown): ViewMode => {
  const requested = Array.isArray(query) ? query[0] : query;
  return isViewMode(requested)
    ? requested
    : isViewMode(stored)
      ? stored
      : 'classic';
};
