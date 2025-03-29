
// Central hub for type exports to reduce duplicate definitions
export * from './users';
export * from './clients';
export * from './contracts';
export * from './sites';
export * from './common';
export * from './exportTypes';
export * from './importTypes';

// Reexport the JSON type for convenience
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
