import { createContext, useContext, type ReactNode } from 'react'

/**
 * Citations and claim-status badges are research apparatus. They belong in Evidence,
 * not in the working surfaces — a reader in Operating Model should not be reading
 * section numbers. Wrapping a subtree in <Citations> turns them back on.
 */
const CitationCtx = createContext(false)

export function Citations({ children }: { children: ReactNode }) {
  return <CitationCtx.Provider value={true}>{children}</CitationCtx.Provider>
}

export function useCitationsVisible() {
  return useContext(CitationCtx)
}
