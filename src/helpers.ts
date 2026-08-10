export const isPresent = <T>(value: T | null | undefined): value is T =>
  value != null

export const filterMap = <T, U>(
  array: T[],
  mappingFn: (value: T, index: number, array: T[]) => U | null | undefined,
): U[] => {
  const result: U[] = []

  array.forEach((item, index) => {
    const mapped = mappingFn(item, index, array)
    if (isPresent(mapped)) result.push(mapped)
  })

  return result
}
