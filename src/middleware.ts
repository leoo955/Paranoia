import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isSetupPage = req.nextUrl.pathname === "/setup";
    
    // Si l'utilisateur est connecté mais n'a pas de pseudo, forcer la page setup
    if (token && !token.minecraftName && !isSetupPage) {
      return NextResponse.redirect(new URL("/setup", req.url));
    }
    
    // S'il a déjà un pseudo, l'empêcher de retourner sur setup
    if (token && token.minecraftName && isSetupPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protection de la page admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Laisse la fonction middleware faire les vérifications
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
