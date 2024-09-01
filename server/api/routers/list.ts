import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { lists } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const listRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.lists.findFirst({
        where: and(
          eq(lists.id, input.listId),
          eq(lists.userId, ctx.session.user.id),
        ),
      });
    }),

  add: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(lists).values({
        name: input.name,
        userId: ctx.session.user.id,
      });
    }),

  getUserLists: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: lists.id,
        name: lists.name,
        balance: lists.balance,
        updatedAt: lists.updatedAt,
      })
      .from(lists)
      .where(eq(lists.userId, ctx.session.user.id))
      .orderBy(desc(lists.updatedAt));
  }),
});
