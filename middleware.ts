import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin",
  },
});

// Protège /admin/dashboard, /admin/actualites, etc.
// mais PAS /admin lui-même (la page de connexion)
export const config = {
  matcher: ["/admin/:path+"],
};

