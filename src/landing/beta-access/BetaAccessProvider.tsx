import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { openBetaInNewTab } from "@/landing/constants"
import { captureLandingAttribution } from "./attribution"
import { BetaAccessModal } from "./BetaAccessModal"
import { identifyBetaVisitor } from "./identify"
import { readBetaAccessGrant } from "./storage"

type BetaAccessContextValue = {
  requestBetaAccess: (source?: string) => void
  hasBetaAccess: boolean
  grantedEmail: string | null
}

const BetaAccessContext = createContext<BetaAccessContextValue | null>(null)

export function useBetaAccess() {
  const ctx = useContext(BetaAccessContext)
  if (!ctx) {
    throw new Error("useBetaAccess must be used within BetaAccessProvider")
  }
  return ctx
}

export function BetaAccessProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSource, setModalSource] = useState("unknown")
  const [grant, setGrant] = useState(() => readBetaAccessGrant())

  useEffect(() => {
    captureLandingAttribution()
  }, [])

  useEffect(() => {
    if (grant?.email) {
      identifyBetaVisitor(grant.email)
    }
  }, [grant?.email])

  const openBetaApp = useCallback(() => {
    openBetaInNewTab()
  }, [])

  const requestBetaAccess = useCallback(
    (source = "unknown") => {
      const existing = readBetaAccessGrant()
      if (existing?.email) {
        setGrant(existing)
        openBetaApp()
        return
      }
      setModalSource(source)
      setModalOpen(true)
    },
    [openBetaApp],
  )

  const value = useMemo(
    () => ({
      requestBetaAccess,
      hasBetaAccess: !!grant?.email,
      grantedEmail: grant?.email ?? null,
    }),
    [grant, requestBetaAccess],
  )

  return (
    <BetaAccessContext.Provider value={value}>
      {children}
      <BetaAccessModal
        open={modalOpen}
        source={modalSource}
        onClose={() => setModalOpen(false)}
        onGranted={(email) => setGrant({ email, grantedAt: Date.now() })}
      />
    </BetaAccessContext.Provider>
  )
}
