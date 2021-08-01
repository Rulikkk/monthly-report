import { selector } from "recoil";
import { http } from "./utils";
// import { transformKeys } from "./helpers";
import { activeReportIdData } from "./atoms";
// import camelCase from "lodash.camelcase";
import { ALL_REPORTS_IDS, ACTIVE_REPORT } from "./keys";
import groupBy from "lodash.groupby";

export let allReportsIdsQuery = selector({
  key: ALL_REPORTS_IDS,
  get: async () => {
    let { data } = await http.get("/months");
    return data.sort((a, b) => (a.id > b.id ? -1 : 1));
  }
});

export let activeReportQuery = selector({
  key: ACTIVE_REPORT,
  get: async ({ get }) => {
    let reportId = get(activeReportIdData);
    if (reportId === null) return;
    let { data } = await http.get(`/month/${reportId}`);

    data = {
      ...data,
      projects: groupBy(
        await Promise.all(
          data.project_statuses_ids.map(async (statusId) => {
            let { data } = await http.get(`/project_status/${statusId}`);
            return data;
          })
        ),
        ({ status_color }) => status_color
      )
    };

    console.log({ data });

    return data;
  }
});
