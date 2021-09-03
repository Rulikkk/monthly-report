import React, {useEffect, useState} from "react"
import { Link } from "@reach/router";
import { useRecoilCallback, useRecoilValueLoadable } from "recoil";
import {
  allReportsIds,
  config,
  reportQuery
} from "../MonthlyReport/store/state";

const Home = () => {
  const ids = useRecoilValueLoadable(allReportsIds);
  const [reportLink, setReportLink] = useState('last');
  const [lastReportId, setLastReportId] = useState(null);
  const [preLastReportId, setPreLastReportId] = useState(null);

  const preloadReport = useRecoilCallback(({ snapshot }) => (id) => {
    snapshot.getLoadable(reportQuery(id));
  });

  const preloadConfig = useRecoilCallback(({ snapshot }) => () => {
    snapshot.getLoadable(config());
  });

  useEffect(() => {
    preloadConfig();
  }, []);

  useEffect(() => {
    if (ids.state === 'hasValue' && Array.isArray(ids.contents) ) {
      setLastReportId(ids.contents?.[0])
      setPreLastReportId(ids.contents?.[1])
    }
  }, [ids])

  useEffect(() => {
    if (lastReportId) {
      setReportLink(lastReportId)
      preloadReport(lastReportId);
    }
  }, [lastReportId])

  useEffect(() => {
    preLastReportId && preloadReport(preLastReportId);
  }, [preLastReportId])

  return (
    <div
      className="container p-4 mx-auto max-w-4xl"
      style={{ paddingRight: "34px" }}
    >
      <img alt="Logo" src="/head.png" className="mx-auto" />
      <nav className="list-disc list-inside m-8">
        <li>
          <Link to={`/report/${reportLink}`} className="underline">
            Delivery reports
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default Home;
