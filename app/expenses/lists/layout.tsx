import { redirect } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { validateRequest } from "@/lib/auth";
import { getUserLists } from "@/lib/db/query";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const userLists = await getUserLists(user.id);
  const balance = userLists[0].balance;

  return (
    <>
      <div className="mb-4 space-y-2 text-center">
        <p className="text-sm font-light">
          คงเหลือ ณ วันที่{" "}
          <span className="font-normal text-blue-600">
            {new Date().toISOString().split("T")[0]}
          </span>
        </p>
        <h2 className="text-4xl font-bold">{formatNumber(balance)}</h2>
      </div>
      <div className="overflow-auto">{children}</div>
    </>
  );
}
