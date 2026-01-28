export default function ClientDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {[0, 1, 2, 3].map((row) => (
          <div key={row}>
            {row > 0 ? <div className="h-px bg-black/5" /> : null}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="h-3 w-20 rounded bg-black/5" />
              <div className="h-4 w-32 rounded bg-black/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="h-[52px] rounded-2xl border border-black/5 bg-white" />
        <div className="h-[52px] rounded-2xl border border-black/5 bg-white" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((card) => (
          <div
            key={card}
            className="rounded-2xl border border-black/5 bg-white px-3 py-2 text-center shadow-sm"
          >
            <div className="mx-auto mb-1 h-3 w-16 rounded bg-black/5" />
            <div className="mx-auto h-4 w-12 rounded bg-black/5" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-6">
        <div className="h-3 w-28 rounded bg-black/5" />
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-[76px] rounded-2xl border border-black/5 bg-white shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

