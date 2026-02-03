import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scenarios/:path*",
    "/events/:path*",
    "/alerts/:path*",
    "/watchlist/:path*",
    "/companies/:path*",
  ],
};
