import "./typedef";

import React, { Fragment, Suspense } from "react";
import { useParams, navigate } from "@reach/router";

import { useRecoilValue } from "recoil";

import * as state from "./store/state";

import { useActiveAndPrevReport, useActiveReport } from "./store/hooks";

import {
  PROJECT_STATES,
  PROJECT_STATES_ALL,
  TERMINATED,
  GREEN,
  YELLOW,
  RED
} from "./const";
import { initCap } from "./BaseComponents";
import { Scrollable } from "./Scrollable";
import { Praises } from "./Praises";

import BenchInfoSection from "./BenchInfoSection";
import Spinner from "../Spinner";

const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric"
});

const formatIdAsDate = (id) => formatter.format(Date.parse(id + "-01"));

const ReportSelector = () => {
  let allReportsIds = useRecoilValue(state.allReportsIds);

  const routeParams = useParams();
  if (!routeParams.reportId) navigate("/report/last");
  const activeReportId = routeParams.reportId;

  return !activeReportId ? (
    "Loading..."
  ) : (
    <>
      <select
        value={activeReportId}
        onChange={(e) => navigate(`/report/${e.target.value}`)}
        className="text-3xl font-bold mt-3 bg-gray-200 rounded leading-tight no-print"
      >
        {allReportsIds.map((r) => (
          <option className="text-normal" value={r} key={r}>
            {formatIdAsDate(r)}
          </option>
        ))}
      </select>
      <span className="text-3xl font-bold mt-3 leading-tight only-print">
        {formatIdAsDate(activeReportId)}
      </span>
    </>
  );
};

const B = ({ children }) => <span className="font-bold">{children}</span>;

const Note = ({
  notes = [
    `Edit "notes" in data.json to update this section.<br>
      Then click "Edit" -> "Load" to apply changes.<br>
      "Notes" is an array, which is joined and set as html.`
  ]
}) => (
  <ul
    className="list-disc list-inside bg-gray-200 p-4 text-sm"
    dangerouslySetInnerHTML={{ __html: notes.join("\n") }}
  />
);

const Td = ({
  children,
  className,
  yellow,
  red,
  green,
  bold,
  c = (f, t) => (f ? ` ${t}` : "")
}) => (
  <td
    className={
      "p-1 pl-3 w-1/4 whitespace-pre-line text-left align-top " +
      className +
      c(red, "bg-red-200") +
      c(green, "bg-green-200") +
      c(yellow, "bg-yellow-200") +
      c(bold, "font-bold")
    }
  >
    {children}
  </td>
);

const TotalsTable = () => {
  const {
    activeReport: { projects },
    prevReport: { projects: prevProjects }
  } = useActiveAndPrevReport();
  const Row = ({ cells, ...props }) => (
      <tr>
        <Td {...props}>{cells[0]}</Td>
        <Td green {...props}>
          {cells[1]}
        </Td>
        <Td yellow {...props}>
          {cells[2]}
        </Td>
        <Td red {...props}>
          {cells[3]}
        </Td>
      </tr>
    ),
    sum = (a, b) => a + b,
    countProjects = (ps) =>
      ps && PROJECT_STATES.map((t) => (ps[t] ? ps[t].length : 0)).reduce(sum),
    totalProjectsNow = countProjects(projects),
    totalProjectsThen = countProjects(prevProjects),
    totals = { totalNow: totalProjectsNow, totalThen: totalProjectsThen },
    Comparer = ({
      now,
      then = 0,
      totalNow,
      totalThen,
      tip,
      projectState,
      lowerBetter = false
    }) => {
      const percent = (v, t) => Math.round((100 * v) / t),
        nowValue = totalNow ? percent(now, totalNow) : now,
        thenValue = totalThen ? percent(then, totalThen) : then,
        maybePercent = totalNow || totalThen ? "%" : "",
        change = nowValue - thenValue,
        changeText = ` ${
          change > 0
            ? "increased by " + change
            : change < 0
            ? "decreased by " + -change
            : "not changed"
        }`,
        good =
          nowValue === thenValue ||
          (lowerBetter && nowValue < thenValue) ||
          (!lowerBetter && nowValue > thenValue),
        arrow = thenValue > nowValue ? "↓" : "↑",
        title =
          (tip && tip + changeText) ||
          (totalNow
            ? `Percentage of ${projectState} projects from total${changeText}`
            : `Number of ${projectState} projects${changeText}`);
      return (
        <span title={title} className="cursor-default">
          {nowValue + maybePercent}{" "}
          <span
            className={
              "font-normal text-sm " +
              (good ? "text-green-400" : "text-red-400")
            }
          >
            ({arrow}
            {Math.abs(nowValue - thenValue) + maybePercent})
          </span>
        </span>
      );
    },
    TdComparer = ({ projectState, ...props }) =>
      projects && projects[projectState] ? (
        <Td {...{ [projectState]: true }}>
          <Comparer
            now={projects[projectState] && projects[projectState].length}
            then={
              prevProjects &&
              prevProjects[projectState] &&
              prevProjects[projectState].length
            }
            lowerBetter={projectState === YELLOW || projectState === RED}
            projectState={projectState}
            {...props}
          />
        </Td>
      ) : null;

  console.log({ totalProjectsNow, totalProjectsThen });

  return (
    <>
      <table className="mt-3 text-left font-mono w-full border-collapse">
        <thead style={{ borderBottom: "solid silver 1px" }}>
          <Row
            bold
            cells={[
              "Total Projects",
              "Green State",
              "Yellow State",
              "Red State"
            ]}
          />
        </thead>
        <tbody>
          <tr>
            <Td bold>
              <Comparer
                now={totalProjectsNow}
                then={totalProjectsThen}
                tip={"Total projects"}
                lowerBetter={false}
              />
            </Td>
            <TdComparer projectState={GREEN} />
            <TdComparer projectState={YELLOW} />
            <TdComparer projectState={RED} />
          </tr>
          <tr>
            <Td bold>%</Td>
            <TdComparer projectState={GREEN} {...totals} />
            <TdComparer projectState={YELLOW} {...totals} />
            <TdComparer projectState={RED} {...totals} />
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-gray-600 pl-3">
        * Numbers in brackets show comparison to previous month
      </p>
    </>
  );
};

const ProjectStatus = ({ project, hideOK }) => {
  const { issues, staffing, notes } = project || {
    issues: null,
    staffing: null,
    notes: null
  };
  return (
    <ul>
      {issues ? (
        issues.map((i) =>
          i ? (
            <Fragment key={i.id}>
              <li>{i.issue}</li>
              <li className="mb-2">
                <B>Mitigation: </B>
                {i.mitigation} <B>ETA: </B> {i.eta || "none"}
              </li>
            </Fragment>
          ) : (
            ""
          )
        )
      ) : (
        <>
          {!hideOK && <B>OK. </B>}
          {notes && <span className="text-gray-600">{notes}</span>}
        </>
      )}
      {staffing && (
        <li className="text-blue-500">
          <B>Staffing: </B>
          {staffing}
        </li>
      )}
      {issues && issues.length > 0 && notes && (
        <li className="text-gray-600">
          <B>Notes: </B>
          {notes}
        </li>
      )}
    </ul>
  );
};

const ProjectTable = ({ projectState }) => {
  const { reportId } = useParams();
  const projects = useRecoilValue(
    state.statusesByColor({ reportId, color: projectState })
  );
  console.log(`Render ${projects.length} projects ${projectState}`);
  return projects.length === 0 ? (
    "No projects"
  ) : (
    <table className="mt-3 w-full border-collapse">
      <thead style={{ borderBottom: "solid silver 1px" }}>
        <tr>
          <Td bold>Project</Td>
          <Td bold className="w-3/4">
            Status
          </Td>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} style={{ borderBottom: "solid silver 1px" }}>
            <Td className="align-top" {...{ [projectState]: true }}>
              {project && project.name}
            </Td>
            <Td {...{ [projectState]: true }}>
              <ProjectStatus
                project={project}
                hideOK={projectState === TERMINATED}
              />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ProjectListForState = (p) => {
  return (
    <>
      <h1 className="text-3xl mt-5">{initCap(p.projectState)}</h1>
      <ProjectTable {...p} />
    </>
  );
};

const ReportHeader = () => {
  let {
    value: { notes, reportName }
  } = useRecoilValue(state.configQuery());
  // console.log("Render report header");
  return (
    <>
      <img alt="Logo" src="/head.png" className="mx-auto" />
      <h1 className="text-3xl">
        <ReportSelector /> — {reportName || "<data.reportName>"}
      </h1>
      <Note notes={notes} />
    </>
  );
};

const ReportBody = () => {
  let { benchInfoData, praises } = useActiveReport();
  // console.log("Render report body");
  return (
    <>
      {benchInfoData?.benchSectionEnabled && <BenchInfoSection />}

      {PROJECT_STATES_ALL.map((status) => (
        <ProjectListForState key={status} projectState={status} />
      ))}
      <Praises praises={praises} />
    </>
  );
};

export default () => {
  // console.log("Render report");
  return (
    <Scrollable>
      <div className="container p-4 mx-auto max-w-4xl">
        <ReportHeader />
        <Suspense fallback={<Spinner text="Loading report data" high />}>
          <TotalsTable />
          <ReportBody />
        </Suspense>
      </div>
    </Scrollable>
  );
};
