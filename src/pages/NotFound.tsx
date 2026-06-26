import { useEffect, useState } from "react"
import { LandingFooter, LandingNav } from "@/landing/shared"
import { Link, useRoute } from "@/router"

export function NotFoundPage() {
  const pathname = useRoute()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-white text-[#4e4646]">
      <LandingNav />

      <main
        id="main"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-16 sm:px-6"
      >
        <p className="font-ui text-[13px] font-semibold uppercase tracking-[0.12em] text-[#01b4c8]">
          404
        </p>
        <h1 className="font-display mt-4 text-balance text-[36px] italic leading-[1.1] text-[#4e4646] sm:text-[44px] lg:text-[52px]">
          Page not found
        </h1>
        <p className="font-ui mt-5 max-w-xl text-[15px] leading-[1.7] text-[#627c86] lg:text-[16px]">
          {hydrated ? (
            <>
              We couldn&rsquo;t find{" "}
              <span className="font-medium text-[#4e4646]">{pathname}</span>.
              It may have moved, or the link could be out of date.
            </>
          ) : (
            <>
              We couldn&rsquo;t find the page you&rsquo;re looking for. It may
              have moved, or the link could be out of date.
            </>
          )}
        </p>

        <div className="font-ui mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#01b4c8] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#019aab]"
          >
            Back to home
          </Link>
          <Link
            to="/support"
            className="text-[14px] text-[#01b4c8] underline-offset-2 hover:underline"
          >
            Contact support
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
