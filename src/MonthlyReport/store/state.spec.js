import axios from "axios";
import { snapshot_UNSTABLE } from "recoil";

import { allReportsIds, configQuery, reportQuery } from "./state";

describe("allReportsIds selector", () => {
  it("fetches an array of the all reports ids", async () => {
    let initialSnapshot = snapshot_UNSTABLE();
    let mockData = [{ id: "2020-01" }, { id: "2019-02" }, { id: "2018-03" }];
    axios.get.mockResolvedValueOnce({ data: mockData });
    expect(await initialSnapshot.getPromise(allReportsIds)).toEqual(mockData.map(({ id }) => id));
  });
});

describe("reportQuery selectorFamily", () => {
  it("fetches an object representing a report and applies transformations", async () => {
    let initialSnapshot = snapshot_UNSTABLE();
    let mockData = { id: "some report", project_statuses: [] };
    let resultData = {
      id: mockData.id,
      code: mockData.id,
      benchInfoData: undefined,
      projects: { green: [], yellow: [], red: [], terminated: [] },
    };
    axios.get.mockResolvedValueOnce({ data: mockData });
    expect(await initialSnapshot.getPromise(reportQuery("id must be defined"))).toEqual(resultData);
  });
});

describe("configQuery selectorFamily", () => {
  it("fetches an object representing a config", async () => {
    let initialSnapshot = snapshot_UNSTABLE();
    let mockData = { value: { someProp: "someValue" } };
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));
    expect(await initialSnapshot.getPromise(configQuery())).toEqual(mockData);
  });
});
