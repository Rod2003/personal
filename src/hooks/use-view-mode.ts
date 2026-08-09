import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  isViewMode,
  resolveViewMode,
  ViewMode,
  VIEW_STORAGE_KEY,
} from '../utils/view-mode';

export const useViewMode = () => {
  const router = useRouter();
  const [mode, setMode] = useState<ViewMode | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const resolved = resolveViewMode(router.query.view, stored);
    setMode(resolved);

    const requested = Array.isArray(router.query.view)
      ? router.query.view[0]
      : router.query.view;
    if (isViewMode(requested)) {
      window.localStorage.setItem(VIEW_STORAGE_KEY, requested);
    }
  }, [router.isReady, router.query.view]);

  const setViewMode = useCallback(
    (nextMode: ViewMode) => {
      setMode(nextMode);
      window.localStorage.setItem(VIEW_STORAGE_KEY, nextMode);
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, view: nextMode },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return { mode, setViewMode };
};
