import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { expenses, lists } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import dayjs from "@/lib/dayjs";
import { updateBalance } from "@/lib/db/query";

export const expenseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        month: z.string().default(() => dayjs().format("YYYY-MM")),
      }),
    )
    .query(async ({ input, ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const startOfMonth = dayjs(input.month)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs(input.month).endOf("month").format("YYYY-MM-DD");

      const list = await ctx.db.query.lists.findFirst({
        where: eq(lists.id, input.listId),
      });

      const result = await ctx.db
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
            eq(expenses.listId, input.listId),
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
    }),

  create: protectedProcedure
    .input(
      z
        .object({
          listId: z.string(),
          date: z.string(),
          name: z.string(),
          amount: z.number(),
        })
        .array(),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(expenses).values(input);
      const total = input.reduce((sum, { amount }) => sum + amount, 0);
      await updateBalance(input[0].listId, total);

      return true;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          listId: z.string(),
          date: z.string(),
          name: z.string(),
          amount: z.number(),
        }),
        diffAmount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(expenses)
        .set(input.data)
        .where(eq(expenses.id, input.id));
      await updateBalance(input.data.listId, input.diffAmount);
      return true;
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const expense = await ctx.db.query.expenses.findFirst({
        where: eq(expenses.id, input),
      });
      if (!expense) {
        return false;
      }
      await ctx.db.delete(expenses).where(eq(expenses.id, input));
      await updateBalance(expense.listId, -expense.amount);
      return true;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const expenses = await ctx.db.query.expenses.findMany({});
    return expenses;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
