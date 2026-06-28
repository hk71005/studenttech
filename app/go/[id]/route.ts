import { NextRequest, NextResponse } from "next/server";
import { buildAffiliateUrl } from "@/config/affiliate";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitize: only alphanumeric + hyphens (valid ASIN format)
  if (!/^[A-Z0-9\-]{1,20}$/i.test(id)) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  const affiliateUrl = buildAffiliateUrl(id);

  return NextResponse.redirect(affiliateUrl, {
    status: 302,
    headers: {
      // No cache — affiliate links should always resolve fresh
      "Cache-Control": "no-store",
    },
  });
}
