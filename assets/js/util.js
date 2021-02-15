// Given a string, return the unique digits in it
// If there are duplicates, keep the first instance only
export function uniqDigits(str) {
  let result = "";
  for (const c of str) {
    if (c >= '0' && c <= '9' && !result.includes(c)) {
      result += c;
    }
  }
  return result;
}