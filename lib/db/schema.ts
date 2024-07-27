import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  text,
  real,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString()),
});

export const session = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const lists = sqliteTable("lists", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  balance: real("balance").default(0).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString()),
});

export const expenses = sqliteTable(
  "expenses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    amount: real("amount").notNull(),
    date: text("date")
      .default(sql`(CURRENT_DATE)`)
      .notNull(),
    listId: text("list_id")
      .notNull()
      .references(() => lists.id),
    timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => {
    return {
      listIdDateIdx: index("list_id_date_idx").on(t.listId, t.date),
      dateIdx: index("date_idx").on(t.date),
      listIdx: index("list_idx").on(t.listId),
    };
  },
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  lists: many(lists),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  list: one(lists, {
    fields: [expenses.listId],
    references: [lists.id],
  }),
}));

export type Expense = typeof expenses.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;
