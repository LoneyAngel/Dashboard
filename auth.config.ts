import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; 
      } 
      const isRootPath = nextUrl.pathname === '/'; 
    
        if (isLoggedIn) {
            // 如果用户已登录，但访问的既不是仪表板，也不是根路径（例如 /login）
            if (isRootPath) {
                return true; // 允许已登录用户访问 '/'
            }
            // 对于其他公共路径（如 /login），重定向到 /dashboard
            return Response.redirect(new URL('/dashboard', nextUrl)); 
        }
    return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;