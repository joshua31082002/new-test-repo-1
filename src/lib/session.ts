import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getSessionId() {
  const store = await cookies();
  let sessionId = store.get("qc_session")?.value;
  if (!sessionId) {
    sessionId = randomUUID();
    store.set("qc_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return sessionId;
}
