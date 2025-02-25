const compareString = (a: unknown, b: unknown) => {
   return a?.toString?.()?.toLowerCase?.() === b?.toString?.()?.toLowerCase?.();
};

export {
   compareString
}