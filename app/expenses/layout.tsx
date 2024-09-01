import { redirect } from "next/navigation";
import { logout } from "@/app/actions";
import { validateRequest } from "@/lib/auth";
import { FormAction } from "@/components/form-action";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col items-center p-4">
      <div className="flex h-full w-full max-w-md flex-col gap-2 rounded-lg p-6 shadow-md">
        <div className="flex items-center">
          <div className="flex-1">
            <Link href="/expenses">
              <h1 className="text-xl font-bold">{user.name}</h1>
            </Link>
          </div>
          <FormAction action={logout}>
            <SubmitButton variant="link">ออกจากระบบ</SubmitButton>
          </FormAction>
        </div>
        <div className="flex h-full flex-1 flex-col overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
