import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Tudo é protegido, exceto as telas de autenticação. Sem este middleware o
// Clerk v6 não consegue resolver `auth()`/`currentUser()` no servidor.
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignora internals do Next e arquivos estáticos (inclui manifest.json do PWA).
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|svg|png|ico|webp|woff2?|ttf|map|json|txt)).*)",
    // Sempre roda nas API routes.
    "/(api|trpc)(.*)",
  ],
};
