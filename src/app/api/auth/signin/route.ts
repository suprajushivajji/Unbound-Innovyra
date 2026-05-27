import { NextResponse } from "next/server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: parsed.data.email }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcryptjs.compare(
      parsed.data.password,
      (user as any).password as string
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In a real app, you'd create a session or JWT token here
    // For now, returning success means the credentials are valid
    return NextResponse.json(
      { message: "Sign in successful", userId: (user as any)._id?.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Sign in failed" },
      { status: 500 }
    );
  }
}
