import React from "react";
import { Link } from "@reach/router";
import { useRecoilValueLoadable } from "recoil";
import { allReportsIds } from "../MonthlyReport/store/state";

const Home = () => {
  const ids = useRecoilValueLoadable(allReportsIds);

  let last = "last";
  if (ids.state === "hasValue" && ids.contents && ids.contents.length > 0) {
    last = ids.contents[0];
  }

  const reportLink = `/report/${last}`;

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
