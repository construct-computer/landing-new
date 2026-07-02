import type { ComparisonRow } from "@/content/vs"

export function ComparisonTable({
  competitor,
  rows,
}: {
  competitor: string
  rows: readonly ComparisonRow[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-[#e5e7eb]">
            <th className="py-3 pr-4 text-left font-medium text-[#4e4646]" />
            <th className="py-3 px-4 text-left font-medium text-[#4e4646]">
              {competitor.split(",")[0].trim()}
            </th>
            <th className="py-3 pl-4 text-left font-medium text-[#01b4c8]">Construct</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-[#f0f2f3]">
              <th className="py-3 pr-4 text-left font-medium text-[#4e4646]">
                {row.feature}
              </th>
              <td className="py-3 px-4 align-top text-[#627c86]">{row.competitor}</td>
              <td className="py-3 pl-4 align-top text-[#627c86]">{row.construct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function WhenToChoose({
  competitor,
  construct,
  competitorReasons,
}: {
  competitor: string
  construct: readonly string[]
  competitorReasons: readonly string[]
}) {
  const competitorName = competitor.split(",")[0].trim()
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h3 className="font-ui mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#01b4c8]">
          Choose Construct when
        </h3>
        <ul className="list-disc space-y-2 pl-5 marker:text-[#cfd7db]">
          {construct.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-ui mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#4e4646]">
          Choose {competitorName} when
        </h3>
        <ul className="list-disc space-y-2 pl-5 marker:text-[#cfd7db]">
          {competitorReasons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
