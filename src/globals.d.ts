// TypeScript 6 enables noUncheckedSideEffectImports by default, which rejects
// `import '@/styles/globals.css'` because a stylesheet has no type. Declaring
// the module satisfies the check without disabling it for the whole project.
declare module '*.css';
