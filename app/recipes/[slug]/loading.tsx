function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[14px] bg-surface motion-reduce:animate-none ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-10 px-4 pt-8 pb-16 sm:px-6" aria-busy="true" aria-label="Loading recipe">
      <div className="hidden flex-[1_1_220px] flex-col gap-2 lg:flex">
        {Array.from({ length: 12 }, (_, i) => (
          <Block key={i} className="h-8" />
        ))}
      </div>
      <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-8">
        <div className="flex flex-col gap-3.5">
          <Block className="h-4 w-40" />
          <Block className="h-14 w-[min(420px,100%)]" />
          <Block className="h-5 w-[min(620px,100%)]" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Block className="h-[458px] min-w-0 flex-[999_1_480px] rounded-[20px]" />
          <Block className="h-[458px] min-w-0 flex-[1_1_280px] rounded-[20px]" />
        </div>
        <Block className="h-[420px] rounded-[20px]" />
      </div>
    </div>
  );
}
