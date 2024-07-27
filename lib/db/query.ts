import db from ".";
import * as schema from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import dayjs from "@/lib/dayjs";

const lists = schema.lists;
const expenses = schema.expenses;

export async function getUserLists(userId: string) {
  console.log("fetching user lists");
  return db
    .select({
      id: lists.id,
      name: lists.name,
      balance: lists.balance,
    })
    .from(lists)
    .where(eq(lists.userId, userId));
}

export async function getExpenses(listId: string, date = "2024-07") {
  const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

  const result = await db
    .select({
      date: expenses.date,
      data: sql<string>`
      json_group_array(
        json_object(
              'id', expenses.id,
              'name', expenses.name,
              'amount', expenses.amount
            )
          )
        `.as("data"),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.listId, listId),
        sql`${expenses.date} BETWEEN ${startOfMonth} AND ${endOfMonth}`,
      ),
    )
    .groupBy(expenses.date)
    .orderBy(desc(expenses.date));

  const data = result.map((row) => {
    const data = JSON.parse(row.data) as {
      id: number;
      name: string;
      amount: number;
    }[];
    return {
      date: row.date,
      items: [...data].sort((a, b) => b.id - a.id),
      total: data.reduce((acc, { amount }) => acc + amount, 0),
    };
  });

  const monthTotal = data.reduce((sum, { total }) => sum + total, 0);

  return {
    data,
    monthTotal,
  };
}

export type ExpenseListType = Awaited<ReturnType<typeof getExpenses>>;

export async function addExpenses(data: schema.ExpenseInsert[]) {
  await db.insert(expenses).values(data);
  await updateBalance(data[0].listId, data[0].amount);
  return true;
}

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
