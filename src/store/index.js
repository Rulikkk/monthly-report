import camelCase from "lodash.camelcase";
import { atom, selector } from "recoil";

import { transformKeys, renameKey, deleteKeys, apply } from "./helpers";
import { http } from "./utils";
import { PROJECT_STATES_ALL } from "../const";

// current month id, e.g. "2019-01" or null
export let activeReportIdData = atom({
  key: "activeReportId",
  default: null
});

// all months ids, array
export let allReportsIdsQuery = selector({
  key: "allReportsIds",
  get: async () => {
    let { data } = await http.get("/months");
    return data.sort((a, b) => (a.id > b.id ? -1 : 1));
  }
});

// current report, e.g. data.reports[0]
export let activeReportQuery = selector({
  key: "activeReport",
  get: async ({ get }) => {
    let reportId = get(activeReportIdData);
    if (reportId === null) return;
    let { data } = await http.get(`/month/${reportId}`);

    data.projects = {};

    PROJECT_STATES_ALL.forEach(
      (state) =>
        (data.projects[state] = data.project_statuses
          .filter((x) => x.status_color === state)
          .map((x) => x.status))
    );

    data.code = data.id;

    data = apply(data, [
      deleteKeys(["project_statuses", "project_statuses_ids"]),
      transformKeys(camelCase),
      renameKey("benchInfo", "benchInfoData")
    ]);

    console.log(data);
    return data;
  }
});
