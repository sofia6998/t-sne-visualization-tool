export function isEmptyValue(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'number' && isNaN(value))
  );
}