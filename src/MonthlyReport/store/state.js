import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { selector, selectorFamily } from "recoil";

import { pull, push } from "./api";
import { apply, transformKey, transformKeys } from "./helpers";
import { PROJECT_STATES_ALL } from "../const";
import { toast } from "react-toastify";

export let projectQuery = selectorFamily({
  key: "project",
  get: (id) => () => pull("project", id),
  set: (id) => (_, project) => push("project", id)
});

export let reportQuery = selectorFamily({
  key: "report",
  get: (id) => () => {
    if (id)
      return pull("report", id)
        .then(
          ({ data: { project_statuses_ids, project_statuses, ...data } }) => {
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
              data.projects[status] = project_statuses[status] ?? [];
            }

            data = transformKeys(data, camelCase);
            data = apply(data, [
              transformKey("benchInfo", () => "benchInfoData")
            ]);
            data.code = data.id;

            return data;
          }
        )
        .catch((err) => {
          toast.error(`Error while fetching report ${id}`);
          console.error(err);
        });
  },
  set: (id) => (_, report) => {
    push("report", { id, ...report }).catch((err) => {
      toast.error(`Error while updating report ${id || report.id}`);
      console.error(err);
    });
  }
});

export let allReportsIds = selector({
  key: "allReportsIds",
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

export let configQuery = selectorFamily({
  key: "config",
  get: (id = "main") => () =>
    pull("config", id)
      .then(({ data }) => transformKeys(data, camelCase))
      .catch((err) => {
        toast.error(`Error while fetching config ${id}`);
        console.error(err);
      })
});

export let statusesByColor = selectorFamily({
  key: "statusesByColor",
  get: ({ reportId, color }) => ({ get }) =>
    get(reportQuery(reportId)).projects[color]
});
