import { NextRequest, NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/lib/telegram";

const EXCLUDED_PATH_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/api/webhooks/stripe",
];

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const skipInitDataCheck =
    process.env.TELEGRAM_SKIP_INITDATA === "true" ||
    process.env.NODE_ENV === "development";

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/booking")
  ) {
    return NextResponse.next();
  }

  if (skipInitDataCheck) {
    return NextResponse.next();
  }

  const initDataFromQuery = searchParams.get("initData");
  const tgWebAppData = searchParams.get("tgWebAppData");
  const initDataFromTelegramParam = tgWebAppData
    ? decodeURIComponent(tgWebAppData)
    : null;
  const initData =
    request.headers.get("x-telegram-init-data") ||
    initDataFromQuery ||
    initDataFromTelegramParam ||
    request.cookies.get("tg_init_data")?.value;

  if (!initData) {
    return new NextResponse("Missing Telegram initData", { status: 401 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const isValid = await validateTelegramWebAppData(initData, botToken);
  if (!isValid) {
    return new NextResponse("Invalid Telegram initData", { status: 401 });
  }

  const response = NextResponse.next();
  const initDataForCookie = initDataFromQuery || initDataFromTelegramParam;
  if (initDataForCookie) {
    response.cookies.set("tg_init_data", initDataForCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
