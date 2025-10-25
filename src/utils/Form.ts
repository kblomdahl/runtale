export function getNumberFromForm(formData: FormData, key: string, defaultValue: number = 0): number {
  const value = formData.get(key);

  if (value === null || value === '') {
    return defaultValue;
  }

  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function getNumbersFromForm(formData: FormData, key: string, defaultValue: number = 0): number[] {
  return formData.getAll(key).map(value => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  });
}
