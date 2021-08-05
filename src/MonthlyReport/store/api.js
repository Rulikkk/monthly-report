import "../typedef";

import snakeCase from "lodash.snakecase";

import { timestamp, transformKeys } from "./helpers";
import { http } from "./utils";

/**
 * Create or update document
 * @param {string} path HTTP endpoint
 * @param {Report} arg document
 * @returns {Promise}
 */
export function push(path, { id, ...rest }) {
  path = "/" + [path, id].filter(Boolean).join("/");
  console.log(`${timestamp()} [ push ] ${path}`);
  let payload = transformKeys(rest, snakeCase);
  return id ? http.put(path, payload) : http.post(`/${path}`, payload);
}

/**
 * Fetch document
 * @param {string} path HTTP endpoint
 * @param {string} id document identifier
 * @returns {Promise}
 */
export function pull(path, id) {
  path = "/" + [path, id].filter(Boolean).join("/");
  console.log(`${timestamp()} [ pull ] ${path}`);
  return http.get(path);
}
