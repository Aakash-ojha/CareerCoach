import { serialize } from "cookie";

export async function POST() {
  const jwtCookie = serialize("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  const googleSessionCookie = serialize("next-auth.session-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  return new Response("Logged out", {
    headers: {
      "Set-Cookie": [jwtCookie, googleSessionCookie].join(", "),
    },
  });
}
