import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { atom, selector, selectorFamily } from "recoil";

import { transformKeys } from "./helpers";
import { http } from "./utils";

export let activeReportIdData = atom({
  key: "activeReportId",
  default: null
});

export let allReportsIdsQuery = selector({
  key: "allReportsIds",
  get: async () => {
    let { data } = await http.get("/months");
    return data.sort((a, b) => (a.id > b.id ? -1 : 1));
  }
});

export let projectStatusQuery = selectorFamily({
  key: "projectStatus",
  get: statusId => async () => {
    let { data } = await http.get(`/project_status/${statusId}`);
    return data;
  }
});

export let activeReportQuery = selector({
  key: "activeReport",
  get: async ({ get }) => {
    let reportId = get(activeReportIdData);
    if (reportId === null) return;
    let { data } = await http.get(`/month/${reportId}`);

    data = {
      ...data,
      projects: groupBy(
        await Promise.all(
          data.project_statuses_ids.map(statusId => {
            return get(projectStatusQuery(statusId));
          })
        ),
        ({ status_color }) => status_color
      )
    };

    return transformKeys(data, camelCase);
  }
});
