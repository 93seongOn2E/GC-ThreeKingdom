import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export function getAdminSessionFromRequest(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(`${ADMIN_SESSION_COOKIE}=`.length);

  return verifySessionToken(token);
}
