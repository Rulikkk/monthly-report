import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

import { pull, push } from "./api";
import { transformKeys, toObjectByKey } from "./helpers";
import { PROJECT_STATES_ALL } from "../common/constants";
import { toast } from "react-toastify";

export let projectQuery = selectorFamily({
  key: "project",
  get: (id) => () => pull("project", id),
  set: (id) => (_, project) => push("project", id),
});

export const allReportsIdsQuery = selector({
  key: "allReportsIdsQuery",
  get: () =>
    pull("reports")
      .then(({ data }) => data?.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1)))
      .catch((err) => {
        toast.error("Error while fetching available reports list");
        console.error(err);
      }),
});

export const allReportsIds = atom({
  key: "allReportIdsAtom",
  default: allReportsIdsQuery,
});

export let config = atomFamily({
  key: "config/Default",
  default: selectorFamily({
    key: "configQuery",
    get:
      (id = "main") =>
      async () => {
        try {
          let { data } = await pull("config", id);
          data = transformKeys(data, camelCase, [
            "created_at",
            "updated_at",
            "bench_remarks",
            "header_image_src",
            "report_name",
          ]);
          return data;
        } catch (err) {
          toast.error(`Error while fetching config ${id}`);
          console.error(err);
        }
      },
  }),
});

export const reportQuery = selectorFamily({
  key: "reportQuery",
  get: (id) => () => {
    if (!id) throw new Error("Empty ID to get report");
    return pull("report", id)
      .then(({ data: { project_statuses_ids, project_statuses, ...data } }) => {
        data.projects = {};

        project_statuses = project_statuses.map((project) => {
          const {
            status: { name, id, ...restStatus },
            ...restProject
          } = project;
          return { ...restProject, status: restStatus };
        });

        project_statuses = groupBy(project_statuses, ({ status_color }) => status_color);

        for (const status of PROJECT_STATES_ALL) {
          data.projects[status] = toObjectByKey(project_statuses[status] ?? [], "id");
        }

        data = transformKeys(data, (k) => (k === "bench_info" ? "benchInfoData" : camelCase(k)), [
          "bench_info",
          "bench_section_enabled",
          "created_at",
          "report_ids",
          "status_color",
          "updated_at",
        ]);
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
  },
});

export const reportAtomFamily = atomFamily({
  key: "report",
  default: reportQuery,
});

export const benchInfoAtomFamily = atomFamily({
  key: "benchInfoAtomFamily",
  default: selectorFamily({
    key: "benchInfoAtomFamily/Default",
    get:
      ({ reportId }) =>
      ({ get }) =>
        get(reportAtomFamily(reportId)).benchInfoData,
  }),
});

export const statusesByColor = atomFamily({
  key: "statusesByColor",
  default: selectorFamily({
    key: "statusesByColor/Default",
    get:
      ({ reportId, color }) =>
      ({ get }) =>
        get(reportAtomFamily(reportId)).projects[color],
  }),
});

export const statusById = atomFamily({
  key: "statusById",
  default: selectorFamily({
    key: "statusById/Default",
    get:
      ({ reportId, color, id }) =>
      ({ get }) =>
        get(statusesByColor({ reportId, color }))[id],
  }),
});

// export const statusesByColor = selectorFamily({
//   key: "statusesByColor",
//   get:
//     ({ reportId, color }) =>
//     ({ get }) =>
//       get(reportAtomFamily(reportId)).projects[color],
//   set:
//     ({ reportId, color }) =>
//     ({ get, set }, newValue) => {
//       const report = get(reportAtomFamily(reportId));
//       set(reportAtomFamily(reportId), {
//         ...report,
//         projects: { ...report.projects, [color]: newValue },
//       });
//     },
// });
//
// export const statusById = selectorFamily({
//   key: "statusById",
//   get:
//     ({ reportId, color, id }) =>
//     ({ get }) =>
//       get(statusesByColor({ reportId, color }))[id],
//   set:
//     ({ reportId, color, id }) =>
//     ({ get, set }, newValue) => {
//       const report = get(reportAtomFamily(reportId));
//       set(statusesByColor({ reportId, color }), { ...report.projects[color], [id]: newValue });
//     },
// });
