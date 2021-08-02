import "../typedef";

import snakeCase from "lodash.snakecase";

import { transformKeys } from "./helpers";
import { http } from "./utils";

/**
 * Create or update document
 * @param {string} path HTTP endpoint
 * @param {Report} arg document
 * @returns {Promise}
 */
function push(path, { id, ...rest }) {
  let payload = transformKeys(rest, snakeCase);
  return id ? http.put(`/${path}/${id}`, payload) : http.post(`/${path}`, payload);
}

/**
 * Create or update report
 * @param {Report} arg
 * @returns {Promise}
 */
export function pushReport(arg) {
  return push("month", arg);
}

/**
 * Create or update project status
 * @param {*} arg // :FIXME
 * @returns {Promise}
 */
export function pushStatus(arg) {
  return push("status", arg);
}

/**
 * Create or update project
 * @param {Project} arg
 * @returns {Promise}
 */
export function pushProject(arg) {
  return push("project", arg);
}
