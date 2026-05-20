import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 1. Idiomas que manejas
  locales: ['es', 'en', 'fr', 'de'],
  
  // 2. Idioma por defecto
  defaultLocale: 'es',
  
  // 3. Obliga a mantener el prefijo en la URL para blindar los refrescos (F5)
  localePrefix: 'always'
});

export const config = {
  // Vigila la raíz y todas las rutas con idioma
  matcher: ['/', '/(de|en|es|fr)/:path*']
};