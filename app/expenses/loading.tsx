import Spinner from "@/components/spinner";

export default async function Loading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Spinner />
    </div>
  );
}
