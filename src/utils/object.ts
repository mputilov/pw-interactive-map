/**
 * Creates a new object with all properties from the input object except those specified in the keys array
 * @param obj - The source object
 * @param keys - Array of keys to omit from the object
 * @returns A new object without the specified keys
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 * const result = omit(obj, ['a', 'c']); // { b: 2, d: 4 }
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Creates a new object with only the properties specified in the keys array
 * @param obj - The source object
 * @param keys - Array of keys to pick from the object
 * @returns A new object with only the specified keys
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 * const result = pick(obj, ['a', 'c']); // { a: 1, c: 3 }
 * ```
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
