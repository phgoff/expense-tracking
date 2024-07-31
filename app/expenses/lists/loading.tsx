export default function Loading() {
  return (
    <div className="mt-4 flex animate-pulse flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-1/2 rounded bg-gray-200" />
        <div className="h-12 w-1/3 rounded bg-gray-200" />
        <div className="h-10 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-5 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
