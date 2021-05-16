import dotenv from "dotenv";
dotenv.config();
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { MIKRO_OPTIONS } from "@root/config";

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

test("sample", async () => {
  const orm = await MikroORM.init(MIKRO_OPTIONS as any);
  expect(4 + 5).toBe(9);
});
