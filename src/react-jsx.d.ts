// Minimal declaration to satisfy imports of the automatic JSX runtime
// and to ensure TypeScript sees the module when @types/react isn't picked up
declare module 'react/jsx-runtime' {
  export * from 'react';
}
