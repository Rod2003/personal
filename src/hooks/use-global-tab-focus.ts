import { useEffect, RefObject } from 'react';

export function useGlobalTabFocus(
  inputRef: RefObject<HTMLInputElement>,
  disabled: boolean,
) {
  useEffect(() => {
    const handleGlobalTab = (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        !disabled &&
        document.activeElement !== inputRef.current
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalTab);
    return () => window.removeEventListener('keydown', handleGlobalTab);
  }, [inputRef, disabled]);
}
