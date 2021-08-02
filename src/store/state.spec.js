import axios from "axios";
import { snapshot_UNSTABLE } from "recoil";

import { allReportsIds, activeReport } from "./state";

jest.mock("axios");

describe("allReportsIds selector", () => {
  it("fetches an array of the all reports ids", async () => {
    let initialSnapshot = snapshot_UNSTABLE();
    let mockData = ["2020-01", "2019-02", "2018-03"];
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));
    expect(await initialSnapshot.getPromise(allReportsIds)).toEqual(mockData);
  });
});

describe("activeReportId atom", () => {
  it("fires up activeReport selector", async () => {
    let initialSnapshot = snapshot_UNSTABLE();
    let mockData = { id: "activeReport" };
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));
    expect(await initialSnapshot.getPromise(activeReport)).toEqual(mockData);
  });
});
