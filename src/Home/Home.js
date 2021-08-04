import React, { useMemo } from "react";
import { Link } from "@reach/router";
import { useRecoilValue } from "recoil";
import { allReportsIds } from "../MonthlyReport/store/state";

const Home = () => {
  const ids = useRecoilValue(allReportsIds);

  let reportLink = useMemo(() => {
    if (ids.state === "hasValue" && ids.contents?.length > 0) {
      let [last] = ids.contents;
      return `/report/${last}`;
    }
    return "/report/last";
  }, [ids]);

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
