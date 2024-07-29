"use server";

import db from "@/lib/db";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Scrypt, generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import {
  addExpenses,
  addList,
  getExpenses,
  updateExpense,
} from "@/lib/db/query";
import { users, type ExpenseInsert } from "@/lib/db/schema";
import type { ActionResult } from "@/components/form-action";

const expensesPath = "/expenses/lists";

export const adddListAction = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  await addList(name, userId);

  revalidatePath("/expenses");

  return true;
};

export const addExpenesAction = async (data: ExpenseInsert[]) => {
  await addExpenses(data);

  revalidatePath(`${expensesPath}/${data[0].listId}`);

  return true;
};

export const updateExpenseAction = async ({
  id,
  data,
  diffAmount,
}: {
  id: number;
  data: Partial<ExpenseInsert>;
  diffAmount: number;
}) => {
  await updateExpense(id, data, diffAmount);

  revalidatePath(`${expensesPath}/${data.listId}`);

  return true;
};
export const getExpensesByListAction = async (
  listId: string,
  month: string,
) => {
  return getExpenses(listId, month);
};

export const signup = async (
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        error: "Email and password are required",
      };
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (user) {
      return {
        error: "Email already in use",
      };
    }

    const hashedPassword = await new Scrypt().hash(password);
    const userId = generateIdFromEntropySize(10);

    await db.insert(users).values({
      id: userId,
      name: email.split("@")[0],
      email,
      password: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    console.log("signup error:", e);
    return {
      error: "An error occurred",
    };
  }

  // Nextjs's redirect internally throws an error so it should be called outside of try/catch blocks.
  return redirect("/");
};
export const login = async (
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        error: "Email and password are required",
      };
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return {
        error: "Incorrect username or password",
      };
    }

    const isValid = await new Scrypt().verify(user.password, password);

    if (!isValid) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    console.log("login error:", e);
    return {
      error: "An error occurred",
    };
  }

  // Nextjs's redirect internally throws an error so it should be called outside of try/catch blocks.
  return redirect("/");
};

export const logout = async (
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> => {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
};
