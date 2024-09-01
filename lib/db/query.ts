import db from ".";
import * as schema from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import dayjs from "@/lib/dayjs";

const lists = schema.lists;
const expenses = schema.expenses;

export type ExpenseListType = Awaited<
  Promise<{
    data: {
      date: string;
      items: {
        id: number;
        name: string;
        amount: number;
      }[];
      total: number;
    }[];
    monthTotal: number;
    list: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      balance: number;
    };
  }>
>;

export async function updateExpense(
  id: number,
  data: Partial<schema.ExpenseInsert>,
  diffAmount: number,
) {
  if (!data.listId) {
    return false;
  }

  await db.update(expenses).set(data).where(eq(expenses.id, id));

  await updateBalance(data.listId, diffAmount);

  return true;
}

export async function updateBalance(listId: string, amount: number) {
  await db
    .update(lists)
    .set({
      balance: sql`${lists.balance} + ${amount}`,
    })
    .where(eq(lists.id, listId));

  return true;
}
