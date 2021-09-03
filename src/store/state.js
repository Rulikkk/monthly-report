import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

import { pull, push } from "./api";
import { apply, transformKey, transformKeys, toObjectByKey } from "./helpers";
import { PROJECT_STATES_ALL } from "../common/constants";
import { toast } from "react-toastify";

export let projectQuery = selectorFamily({
  key: "project",
  get: (id) => () => pull("project", id),
  set: (id) => (_, project) => push("project", id)
});

export let reportQuery = selectorFamily({
  key: "reportQuery",
  get: (id) => () => {
    if (!id) throw new Error("Empty ID to get report");
    return pull("report", id)
      .then(({ data: { project_statuses_ids, project_statuses, ...data } }) => {
        data.projects = {};

        project_statuses = project_statuses.map((project) => {
          let { name, id, notes, ...restStatus } = project.status;
          let { status, ...restProject } = project;

          return notes
            ? { notes, ...restStatus, ...restProject }
            : { ...restStatus, ...restProject };
        });

        project_statuses = groupBy(
          project_statuses,
          ({ status_color: c }) => c
        );

        for (let status of PROJECT_STATES_ALL) {
          data.projects[status] = toObjectByKey(
            project_statuses[status] ?? [],
            "id"
          );
        }

        data = transformKeys(data, camelCase);
        data = apply(data, [transformKey("benchInfo", () => "benchInfoData")]);
        data.code = data.id;

        return data;
      })
      .catch((err) => {
        toast.error(`Error while fetching report ${id}`);
        console.error(err);
      });
  },
  set: (id) => (_, report) => {
    if (!id) throw new Error("Empty ID to set report");
    push("report", { id, ...report }).catch((err) => {
      toast.error(`Error while updating report ${id || report.id}`);
      console.error(err);
    });
  }
});

export const report = atomFamily({
  key: "report",
  default: reportQuery
});

export let allReportsIdsQuery = selector({
  key: "allReportsIdsQuery",
  get: () =>
    pull("reports")
      .then(({ data }) =>
        data?.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1))
      )
      .catch((err) => {
        toast.error("Error while fetching available reports list");
        console.error(err);
      })
});

export let allReportsIds = atom({
  key: "allReportIdsAtom",
  default: allReportsIdsQuery
});

export let config = atomFamily({
  key: "config/Default",
  default: selectorFamily({
    key: "configQuery",
    get: (id = "main") => () =>
      pull("config", id)
        .then(({ data }) => transformKeys(data, camelCase))
        .catch((err) => {
          toast.error(`Error while fetching config ${id}`);
          console.error(err);
        })
  })
});

export let statusesByColor = atomFamily({
  key: "statusesByColor",
  default: selectorFamily({
    key: "statusesByColor/Default",
    get: ({ reportId, color }) => ({ get }) =>
      get(reportQuery(reportId)).projects[color]
  })
});

export let statusById = atomFamily({
  key: "statusById",
  default: selectorFamily({
    key: "statusById/Default",
    get: ({ reportId, color, id }) => ({ get }) =>
      get(statusesByColor({ reportId, color }))[id]
  })
});
