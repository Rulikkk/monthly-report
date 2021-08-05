import React from "react";
import { Link } from "@reach/router";
import { useRecoilValueLoadable } from "recoil";
import { allReportsIds } from "../MonthlyReport/store/state";

const Home = () => {
  const ids = useRecoilValueLoadable(allReportsIds);

  let reportLink = "/report/last";

  if (ids.state === "hasValue" && ids.contents?.length > 0) {
    let [last] = ids.contents;
    reportLink = `/report/${last}`;
  }

  return (
    <>
      <h1 className="text-3xl text-center">Akvelon API / Data Lake</h1>
      <nav className="list-disc list-inside m-8">
        <li>
          <Link to={reportLink} className="underline">
            Delivery reports
          </Link>
        </li>
      </nav>
    </>
  );
};

export default Home;
