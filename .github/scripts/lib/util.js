import { createHash } from "crypto";

/**
 * group array by key
 * @param {V[]} array
 * @param {(cur: V, idx: number, src: readonly V[]) => K} getKey
 * @returns {[K, V[]][]}
 */
export function groupBy(array, getKey) {
  return Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const list = map.get(key);
      if (list) list.push(cur);
      else map.set(key, [cur]);
      return map;
    }, new Map())
  );
}

/**
 * get sha256 hash of string
 * @param {string} str source string
 * @returns {string} sha256 hash
 */
export function sha256(str) {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}
