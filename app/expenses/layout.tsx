import { redirect } from "next/navigation";
import { logout } from "../actions";
import { formatNumber } from "@/lib/utils";
import { validateRequest } from "@/lib/auth";
import { getUserLists, getExpenses } from "@/lib/db/query";
import { FormAction } from "@/components/form-action";
import { SubmitButton } from "@/components/submit-button";

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
    <div className="flex h-screen flex-col items-center p-4">
      <div className="flex h-full w-full max-w-md flex-col rounded-lg p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
          </div>
          <FormAction action={logout}>
            <SubmitButton variant="link">ออกจากระบบ</SubmitButton>
          </FormAction>
        </div>
        <div className="overflow-auto">
          <div className="mb-4 space-y-2 text-center">
            <p className="text-sm font-light">
              คงเหลือ ณ วันที่{" "}
              <span className="font-normal text-blue-600">
                {new Date().toISOString().split("T")[0]}
              </span>
            </p>
            <h2 className="text-4xl font-bold">{formatNumber(balance)}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
