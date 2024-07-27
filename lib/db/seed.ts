import db from ".";

import * as schema from "./schema";
import { generateId, Scrypt } from "lucia";

const name = ["ค่าน้ำ", "ค่าไฟ", "ค่าอาหาร", "ค่าเดินทาง"];

export async function seed() {
  const password = await new Scrypt().hash("password");
  const userData = Array.from({ length: 1 }, (_, i) => ({
    id: generateId(15),
    name: `user${i + 1}`,
    email: `user${i + 1}@email.com`,
    password,
  }));

  const listData = Array.from({ length: 1 }, (_, i) => ({
    id: generateId(15),
    name: `list${i + 1}`,
    userId: userData[Math.floor(Math.random() * userData.length)].id,
    balance: Math.floor(Math.random() * 1000) / 100,
  }));

  const expenseData = Array.from({ length: 50 }, (_, i) => ({
    listId: listData[Math.floor(Math.random() * listData.length)].id,
    date: new Date(2024, 6, Math.floor(Math.random() * 10) + 1)
      .toISOString()
      .split("T")[0],
    name: name[Math.floor(Math.random() * name.length)],
    amount: Math.floor(Math.random() * 200000 - 100000) / 100,
  }));

  await db.delete(schema.expenses).run();
  await db.delete(schema.lists).run();
  await db.delete(schema.session).run();
  await db.delete(schema.users).run();

  await db.insert(schema.users).values(userData);
  await db.insert(schema.lists).values(listData);
  await db.insert(schema.expenses).values(expenseData);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
