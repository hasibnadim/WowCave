import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/models";
import { getFirebaseAuth } from "@/lib/firebase/admin";
import { sanitizeUser } from "@/lib/auth";

const SESSION_COOKIE_NAME = "wowcave_session";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    const adminAuth = getFirebaseAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin SDK is not configured" }, { status: 500 });
    }

    const decoded = await adminAuth.verifySessionCookie(token, true);
    await connectDB();

    const user = await User.findOne({ email: decoded.email || "" }).lean();
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body ?? {};

    if (!idToken) {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    const adminAuth = getFirebaseAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin SDK is not configured" }, { status: 500 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.email_verified) {
      return NextResponse.json({ error: "Email must be verified" }, { status: 403 });
    }

    await connectDB();

    const firebaseUser = await adminAuth.getUser(decoded.uid);
    const providerData = firebaseUser.providerData.map(({ providerId, uid }) => ({ providerId, uid }));
    const hasPassword = providerData.some((provider) => provider.providerId === "password");
    const provider = hasPassword
      ? "email"
      : providerData[0]?.providerId.replace(/\.com$/, "") || "email";

    const user = await User.findOneAndUpdate(
      { email: decoded.email ?? "" },
      {
        firebaseUid: decoded.uid,
        email: decoded.email ?? "",
        firstName: decoded.name ? decoded.name.split(" ")[0] ?? "" : "",
        lastName: decoded.name ? decoded.name.split(" ").slice(1).join(" ") || "" : "",
        displayName: decoded.name ?? decoded.email?.split("@")[0] ?? "Player",
        emailVerified: decoded.email_verified ?? false,
        photoURL: decoded.picture ?? null,
        provider,
        providerData,
        lastLogin: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: 1000 * 60 * 60 * 24 * 7 });
    const response = NextResponse.json({
      message: "Authenticated successfully",
      user: sanitizeUser(user.toObject ? user.toObject() : user),
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    const adminAuth = getFirebaseAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin SDK is not configured" }, { status: 500 });
    }

    const decoded = await adminAuth.verifySessionCookie(token, true);
    await connectDB();

    const user = await User.findOne({ email: decoded.email || "" });
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (payload.newPassword !== undefined || payload.confirmPassword !== undefined || payload.oldPassword !== undefined) {
      const newPassword = String(payload.newPassword ?? "");
      const confirmPassword = String(payload.confirmPassword ?? "");
      const firebaseUser = await adminAuth.getUser(decoded.uid);
      const hasPassword = firebaseUser.providerData.some((provider) => provider.providerId === "password");

      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters long." }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New password and confirmation do not match." }, { status: 400 });
      }

      if (hasPassword) {
        const oldPassword = String(payload.oldPassword ?? "");
        if (!oldPassword) {
          return NextResponse.json({ error: "Current password is required." }, { status: 400 });
        }

        let apiKey = "";
        try {
          apiKey = String(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT || "{}").apiKey || "");
        } catch {
          return NextResponse.json({ error: "Firebase client configuration is invalid." }, { status: 500 });
        }
        if (!apiKey) {
          return NextResponse.json({ error: "Firebase client API key is not configured." }, { status: 500 });
        }

        const verification = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: decoded.email, password: oldPassword, returnSecureToken: false }),
          }
        );
        if (!verification.ok) {
          return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
        }
      }

      await adminAuth.updateUser(decoded.uid, { password: newPassword });
      const updatedFirebaseUser = await adminAuth.getUser(decoded.uid);
      const updatedProviderData = updatedFirebaseUser.providerData.map(({ providerId, uid }) => ({ providerId, uid }));
      user.providerData = updatedProviderData;
      user.provider = updatedProviderData.some((provider) => provider.providerId === "password")
        ? "email"
        : user.providerData[0]?.providerId.replace(/\.com$/, "") || "email";
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
        user: sanitizeUser(user.toObject ? user.toObject() : user),
      });
    }

    if (payload.firstName !== undefined) user.firstName = String(payload.firstName ?? "").trim() || "";
    if (payload.lastName !== undefined) user.lastName = String(payload.lastName ?? "").trim() || "";
    if (payload.displayName !== undefined) user.displayName = String(payload.displayName ?? "").trim() || user.email.split("@")[0];
    if (payload.username !== undefined) user.username = String(payload.username ?? "").trim() || undefined;
    if (payload.photoURL !== undefined) user.photoURL = String(payload.photoURL ?? "") || undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user.toObject ? user.toObject() : user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
