export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  return classes
    .flatMap((cls) => {

      // skip if null or undefined
      if (!cls) return [];

      // if it is a string then keep it
      if (typeof cls === "string") return [cls];

      // if it's an object then check conditions
      if (typeof cls === "object") {
        return Object.entries(cls)
          .filter(([_, value]) => value)              // keep only true values
          .map(([key]) => key);                       // return the class name
      }

      return [];                                      // ignore anything else
    })
    .join(" ");                                       // join all class names with space
}

export default cx;