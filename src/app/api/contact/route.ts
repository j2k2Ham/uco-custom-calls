import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  // TODO: send via Resend/SendGrid/SES; for now, 200 OK
  console.log("Custom inquiry:", Object.fromEntries(form.entries()));
  return NextResponse.json({ ok: true });
}
