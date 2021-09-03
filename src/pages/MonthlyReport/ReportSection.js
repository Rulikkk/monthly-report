import "../../typedefs";

import React, { Fragment, Suspense } from "react";
import { useParams, navigate } from "@reach/router";

import { useRecoilValue } from "recoil";

import * as state from "../../store/state";

import {
  useActiveAndPrevReport,
  useActiveReport,
  useActiveReportProjectsByColor,
  useProjectStatusById
} from "../../store/hooks";

import {
  PROJECT_STATES,
  PROJECT_STATES_ALL,
  TERMINATED,
  GREEN,
  YELLOW,
  RED
} from "../../common/constants";
import { initCap } from "../../components/pageComponents/MonthlyReport/BaseComponents";
import Scrollable from "../../components/Scrollable";
import { Praises } from "../../components/pageComponents/MonthlyReport/Praises";

import BenchInfoSection from "../../components/pageComponents/MonthlyReport/Bench/BenchInfoSection";
import Spinner from "../../components/Spinner";

const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric"
});

const formatIdAsDate = (id) => formatter.format(Date.parse(id + "-01"));

const ReportSelector = () => {
  const allReportsIds = useRecoilValue(state.allReportsIds);
  const routeParams = useParams();
  const activeReportId = routeParams.reportId;
  if (!activeReportId) navigate("/report/last");

  return (
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

const Notes = ({
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

const TotalsTableHeadRow = ({ cells, ...props }) => (
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
);

const Comparer = ({
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
}

const TdComparer = ({ projects, prevProjects, projectState, ...props }) => {
  if (!projects || !projects[projectState]) {
    return null
  }

  return (
    <Td {...{[projectState]: true}}>
      <Comparer
        now={
          projects[projectState] &&
          Object.keys(projects[projectState]).length
        }
        then={
          prevProjects &&
          prevProjects[projectState] &&
          Object.keys(prevProjects[projectState]).length
        }
        lowerBetter={projectState === YELLOW || projectState === RED}
        projectState={projectState}
        {...props}
      />
    </Td>
  )
}

const TotalsTable = () => {
  const {
    activeReport: { projects },
    prevReport
  } = useActiveAndPrevReport();

  const prevProjects = prevReport?.projects;

  const countProjects = (ps) =>
    ps &&
    PROJECT_STATES.map((t) => (ps[t] ? Object.keys(ps[t]).length : 0)).reduce(
      (a, b) => a + b
    );
  const totalProjectsNow = countProjects(projects);
  const totalProjectsPrev = countProjects(prevProjects);
  const totals = { totalNow: totalProjectsNow, totalPrev: totalProjectsPrev };

  return (
    <>
      <table className="mt-3 text-left font-mono w-full border-collapse">
        <thead style={{ borderBottom: "solid silver 1px" }}>
          <TotalsTableHeadRow
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
                then={totalProjectsPrev}
                tip={"Total projects"}
                lowerBetter={false}
              />
            </Td>
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={GREEN} />
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={YELLOW} />
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={RED} />
          </tr>
          <tr>
            <Td bold>%</Td>
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={GREEN} {...totals} />
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={YELLOW} {...totals} />
            <TdComparer projects={projects} prevProjects={prevProjects} projectState={RED} {...totals} />
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-gray-600 pl-3">
        * Numbers in brackets show comparison to previous month
      </p>
    </>
  );
};

const ProjectStatus = ({ hideOK, color, projectId }) => {
  const [{ id, name, issues, staffing, notes }] = useProjectStatusById(
    color,
    projectId
  );

  return (
    <tr key={id} style={{ borderBottom: "solid silver 1px" }}>
      <Td className="align-top" {...{ [color]: true }}>
        {name}
      </Td>
      <Td {...{ [color]: true }}>
        <ul>
          {issues ? (
            issues.map((i, idx) =>
              i ? (
                <Fragment key={idx}>
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
      </Td>
    </tr>
  );
};

const ProjectTable = ({ projectState }) => {
  const projects = useActiveReportProjectsByColor(projectState);
  return Object.keys(projects).length === 0 ? (
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
        {Object.keys(projects).map((key) => (
          <ProjectStatus
            key={key}
            color={projectState}
            projectId={key}
            hideOK={projectState === TERMINATED}
          />
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
  const {
    value: { notes, reportName }
  } = useRecoilValue(state.config());
  return (
    <>
      <img alt="Logo" src="/head.png" className="mx-auto" />
      <h1 className="text-3xl">
        <ReportSelector /> — {reportName || "<data.reportName>"}
      </h1>
      <Notes notes={notes} />
    </>
  );
};

const ReportBody = () => {
  const { benchInfoData, praises } = useActiveReport();

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
