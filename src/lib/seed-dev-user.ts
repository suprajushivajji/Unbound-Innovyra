import bcryptjs from "bcryptjs";
import { User } from "@/models/User";

const DEMO_EMAIL = "demo@innovyra.com";
const DEMO_PASSWORD = "demo1234";

export async function seedDevUser() {
  const existing = await User.findOne({ email: DEMO_EMAIL }).lean();
  if (existing) return;

  await User.create({
    email: DEMO_EMAIL,
    name: "Demo User",
    password: await bcryptjs.hash(DEMO_PASSWORD, 10),
  });
}

export const demoCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
};
