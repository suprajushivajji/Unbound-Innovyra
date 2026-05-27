import { NextResponse } from "next/server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: parsed.data.email }).lean();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(parsed.data.password, 10);

    const created = await User.create({
      email: parsed.data.email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: created._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
