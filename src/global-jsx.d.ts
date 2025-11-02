// Temporary global JSX declarations to satisfy TypeScript during migration
// This declares all JSX intrinsic elements as 'any'.
// If you'd prefer strict typing, replace this with proper definitions from @types/react
declare namespace JSX {
  // allow any intrinsic element (e.g., <div>, <span>, custom components)
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
