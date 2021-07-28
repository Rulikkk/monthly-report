import axios from 'axios';
import { useEffect, useState } from 'react';

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
      ),
    }))
  );
}

async function push(path, { id, ...payload }) {
  let { code, ...rest } = id
    ? await http.put(`/${path}/${id}`, payload)
    : await http.post(`/${path}`, payload);

  if (code < 200 || code > 300) throw new Error({ code, ...rest });
}
