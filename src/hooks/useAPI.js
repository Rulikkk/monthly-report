import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_STATES_ALL } from "../const";

let http = axios.create({ baseURL: "http://localhost:9292/v1" });

export function useAPI() {
  let [data, setData] = useState();

  useEffect(() => {
    pull().then((reports) => setData({ reports }));
  }, []);

  let pushMonth = (payload) => {
    return push("month", payload);
  };

  let pushProject = (payload) => {
    return push("project", payload);
  };

  return [data, { pushMonth, pushProject }];
}

function renameKey(obj, old, nk) {
  obj[nk] = obj[old];
  delete obj[old];
}

export async function getMonth(id) {
  console.log(`Getting month ${id}`);
  let { data: loadedReport } = await http.get(`/month/${id}`);

  loadedReport.code = loadedReport.id;
  renameKey(loadedReport, "bench_info", "benchInfoData");
  renameKey(
    loadedReport.benchInfoData,
    "bench_section_enabled",
    "benchSectionEnabled"
  );

  loadedReport.projects = {};

  PROJECT_STATES_ALL.forEach(
    (state) =>
      (loadedReport.projects[state] = loadedReport.project_statuses
        .filter((x) => x.status_color === state)
        .map((x) => x.status))
  );

  delete loadedReport["project_statuses_ids"];
  delete loadedReport["project_statuses"];

  return loadedReport;
}

async function pull() {
  let { data } = await http.get("/months");
  return Promise.all(
    data.map(async ({ projects_ids, ...rest }) => ({
      ...rest,
      projects: await Promise.all(
        projects_ids.map(async (id) => {
          let { data } = await http.get(`/project/${id}`);
          return data;
        })
      )
    }))
  );
}

async function push(path, { id, ...payload }) {
  let { code, ...rest } = id
    ? await http.put(`/${path}/${id}`, payload)
    : await http.post(`/${path}`, payload);

  if (code < 200 || code > 300) throw new Error({ code, ...rest });
}
