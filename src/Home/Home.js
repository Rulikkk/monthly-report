import React, { useEffect } from "react";
import { Link } from "@reach/router";
import { useRecoilCallback, useRecoilValueLoadable } from "recoil";
import {
  allReportsIds,
  configQuery,
  reportQuery
} from "../MonthlyReport/store/state";

const Home = () => {
  const ids = useRecoilValueLoadable(allReportsIds);

  let reportLink = "/report/last";
  let last = null,
    preLast = null;

  if (ids.state === "hasValue" && ids.contents?.length > 0) {
    [last, preLast] = ids.contents;
    reportLink = `/report/${last}`;
  }

  const preloadReport = useRecoilCallback(({ snapshot }) => (id) => {
    snapshot.getLoadable(reportQuery(id));
  });

  const preloadConfig = useRecoilCallback(({ snapshot }) => () => {
    snapshot.getLoadable(configQuery());
  });

  useEffect(() => {
    if (last && preLast) {
      preloadReport(last);
      preloadReport(preLast);
      preloadConfig();
    }
  });

  return (
    <div
      className="container p-4 mx-auto max-w-4xl"
      style={{ paddingRight: "34px" }}
    >
      <img alt="Logo" src="/head.png" className="mx-auto" />
      <nav className="list-disc list-inside m-8">
        <li>
          <Link to={reportLink} className="underline">
            Delivery reports
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default Home;
