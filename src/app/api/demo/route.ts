import { NextResponse } from "next/server";
import { getDashboard, performAction } from "@/lib/demo-service";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ data: getDashboard() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: string; payload?: Record<string, string> };
    if (!body.action || !body.payload) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Action and payload are required." } }, { status: 400 });
    const data = performAction(body.action, body.payload);
    if (body.action === "authorize" && "allowed" in data && data.allowed === false) {
      return NextResponse.json({ error: { code: "DECLINED", message: "Authorization declined and recorded." }, data: { result: data, dashboard: getDashboard() } }, { status: 400 });
    }
    return NextResponse.json({ data: { result: data, dashboard: getDashboard() } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: { code: "ACTION_FAILED", message: error instanceof Error ? error.message : "Demo action failed." } }, { status: 400 });
  }
}
