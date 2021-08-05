import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { selector, selectorFamily } from "recoil";

import { pull } from "./api";
import { apply, mapOfKeys, transformKey, transformKeys } from "./helpers";
import { PROJECT_STATES_ALL } from "../const";

export let reportQuery = selectorFamily({
  key: "report",
  get: (id) => async () => {
    if (!id) return;

    let {
      data: { project_statuses_ids, project_statuses, ...data },
    } = await pull("report", id);

    data.projects = {};
    project_statuses = groupBy(project_statuses, ({ status_color: c }) => c);

    for (let status of PROJECT_STATES_ALL) {
      data.projects[status] = project_statuses[status] ?? [];
    }

    data = transformKeys(data, camelCase);
    data = apply(data, [transformKey("benchInfo", () => "benchInfoData")]);
    data.code = data.id;

    return data;
  },
});

export let allReportsIds = selector({
  key: "allReportsIds",
  get: async () => {
    let { data } = await pull("reports");
    return data?.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1));
  },
});

export let configQuery = selectorFamily({
  key: "config",
  get:
    (id = "main") =>
    async () => {
      let { data } = await pull("config", id);
      return transformKeys(data, camelCase);
    },
});

export const statusesByColor = selectorFamily({
  key: "statusesByColor",
  get:
    ({ reportId, color }) =>
    ({ get }) =>
      get(reportQuery(reportId)).projects[color],
});
