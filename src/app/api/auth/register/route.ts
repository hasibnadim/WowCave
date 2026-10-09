import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/models";
import { buildDisplayName, hashPassword, sanitizeUser, setSessionCookie, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const newUser = await User.create({
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      displayName: buildDisplayName(firstName, lastName, email.split("@")[0]),
      username: email.split("@")[0].toLowerCase(),
      password: hashPassword(password),
      provider: "email",
      emailVerified: true,
      providerData: [{ providerId: "password", uid: email }],
    });

    const sessionToken = signSession({
      userId: String(newUser._id),
      email: newUser.email,
      displayName: newUser.displayName,
    });

    const response = NextResponse.json({
      message: "Account created successfully",
      user: sanitizeUser(newUser.toObject ? newUser.toObject() : newUser),
    });

    setSessionCookie(response, sessionToken);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
