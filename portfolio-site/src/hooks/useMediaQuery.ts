import { useSyncExternalStore } from 'react'

function getInitialMatch(query: string) {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false
  }

  return window.matchMedia(query).matches
}

function subscribe(query: string, onStoreChange: () => void) {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return () => undefined
  }

  const mediaQuery = window.matchMedia(query)
  mediaQuery.addEventListener('change', onStoreChange)

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange)
  }
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getInitialMatch(query),
    () => false,
  )
}
