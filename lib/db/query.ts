import db from ".";
import * as schema from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import dayjs from "@/lib/dayjs";

const lists = schema.lists;
const expenses = schema.expenses;

export type ExpenseListType = Awaited<ReturnType<typeof getExpenses>>;
export type UserListType = Awaited<ReturnType<typeof getUserLists>>;

export async function getUserLists(userId: string) {
  return db
    .select({
      id: lists.id,
      name: lists.name,
      balance: lists.balance,
      updatedAt: lists.updatedAt,
    })
    .from(lists)
    .where(eq(lists.userId, userId))
    .orderBy(desc(lists.updatedAt));
}

export async function getList(listId: string) {
  return db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });
}

export async function getExpenses(listId: string, month = "2024-07") {
  const startOfMonth = dayjs(month).startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs(month).endOf("month").format("YYYY-MM-DD");

  const list = await getList(listId);

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
    list: list!,
  };
}

export async function addExpenses(data: schema.ExpenseInsert[]) {
  await db.insert(expenses).values(data);
  const total = data.reduce((sum, { amount }) => sum + amount, 0);
  await updateBalance(data[0].listId, total);
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

export async function addList(name: string, userId: string) {
  await db.insert(lists).values({
    name,
    userId,
  });

  return true;
}
