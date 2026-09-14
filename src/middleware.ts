import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, and files with an extension.
  // `icon` and `apple-icon` are the App Router metadata icon routes: they carry
  // no file extension, so the `.*\..*` clause below doesn't catch them, and
  // without naming them here the i18n middleware would redirect `/apple-icon`
  // to `/id/apple-icon` (a 404). `icon.svg` already has a dot and is exempt,
  // but it's listed too so both icon routes are handled the same way.
  matcher: '/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)',
};
