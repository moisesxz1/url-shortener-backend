const characters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeToBase62(num: number): string {
  let result = '';
  while (num > 0) {
    result = characters[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}
