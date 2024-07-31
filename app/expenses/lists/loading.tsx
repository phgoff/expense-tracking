export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-2">
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="h-4 w-5/6 rounded bg-gray-200" />
    </div>
  );
}
