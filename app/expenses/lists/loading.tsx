import Spinner from "@/components/spinner";

export default async function Loading() {
  return (
    <div className="flex h-full items-center justify-center pt-10">
      <Spinner />
    </div>
  );
}
