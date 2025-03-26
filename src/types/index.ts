
// JSON type for use in database operations
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Json = JsonValue;
