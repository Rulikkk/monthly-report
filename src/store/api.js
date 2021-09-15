import "../typedefs";

import snakeCase from "lodash.snakecase";

import { timestamp, joinAbs, transformKeys } from "./helpers";
import { http } from "./utils";

const DEBUG = true;

/**
 * Create or update document
 * @param {string} path HTTP endpoint
 * @param {Report} arg document
 * @returns {Promise}
 */
export function push(path, { id, ...rest }) {
  console.log(`${timestamp()} [ push ${id ? "id=" + id + " PUT" : "POST"} ] ${path}`);
  let payload = transformKeys(rest, snakeCase, "*");

  if (DEBUG)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(payload);
        resolve();
      }, 200);
    });

  return id ? http.put(joinAbs(path, id), payload) : http.post(`/${path}`, payload);
}

export function cloneLastReport() {
  return http.post("/reports/clone_last");
}

export function updateProjectStatus(id, payload) {
  return http.post(`/project_status/${id}`, payload);
}

export function removeProjectStatus(id) {
  return http.delete(`/project_status/${id}`);
}

export function addProjectStatus(payload) {
  return http.post(`/project_status`, payload);
}

/**
 * Fetch document
 * @param {string} path HTTP endpoint
 * @param {string} id document identifier
 * @returns {Promise}
 */
export function pull(path, id = null) {
  console.log(id ? `${timestamp()} [ pull ] ${path}/${id}` : `${timestamp()} [ pull ] ${path}`);
  return http.get(joinAbs(path, id));
}
