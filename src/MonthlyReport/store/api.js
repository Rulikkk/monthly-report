import "../typedef";

import snakeCase from "lodash.snakecase";

import { timestamp, joinAbs, transformKeys } from "./helpers";
import { http } from "./utils";

/**
 * Create or update document
 * @param {string} path HTTP endpoint
 * @param {Report} arg document
 * @returns {Promise}
 */
export function push(path, { id, ...rest }) {
  console.log(`${timestamp()} [ push ${id ? "id=" + id + " PUT" : "POST"} ] ${path}`);
  let payload = transformKeys(rest, snakeCase);
  return id ? http.put(joinAbs(path, id), payload) : http.post(`/${path}`, payload);
}

/**
 * Fetch document
 * @param {string} path HTTP endpoint
 * @param {string} id document identifier
 * @returns {Promise}
 */
export function pull(path, id = null) {
  console.log(`${timestamp()} [ pull ] ${path}`);
  return http.get(joinAbs(path, id));
}
