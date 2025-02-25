export const compareString = (a: unknown, b: unknown): boolean => {
  return a?.toString?.()?.toLowerCase?.() === b?.toString?.()?.toLowerCase?.();
};
