import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback } from "recoil";

import {
  Button,
  PrintButton,
  Input,
} from "../../components/pageComponents/MonthlyReport/BaseComponents";
import BenchEditorGroup from "../../components/pageComponents/MonthlyReport/Bench/BenchEditorGroup";
import { PROJECT_STATES_ALL } from "../../common/constants";
import { PraiseEditorGroup } from "../../components/pageComponents/MonthlyReport/Praises";
import { addProjectStatus, cloneLastReport, removeProjectStatus } from "../../store/api";
import ProjectState from "./ProjectState";
import Scrollable from "../../components/Scrollable";
import LocalStorageStore from "../../common/localStorageStore";
import { useActiveReport, useActiveReportProjectsByColor } from "../../store/hooks";
import { allReportsIds, reportAtomFamily, statusesByColor } from "../../store/state";

const initCap = (s) => [s[0].toUpperCase(), ...s.slice(1)].join("");

export const Issue = ({ issue, setIssue }) => {
  return (
    <div className="border-l-2 my-4 pl-1">
      Issue
      <Input
        value={issue.issue || ""}
        onChange={(val) => {
          setIssue({ ...issue, issue: val });
        }}
        placeholder="Describe issue here"
        textarea
      />
      <br />
      Mitigation
      <Input
        value={issue.mitigation || ""}
        onChange={(val) => setIssue({ ...issue, mitigation: val })}
        placeholder="Add issue mitigation here"
        textarea
      />
      ETA
      <Input
        value={issue.eta || ""}
        onChange={(val) => setIssue({ ...issue, eta: val })}
        placeholder="Add issue fix ETA here"
      />
      <br />
    </div>
  );
};

const AddProjectButton = ({ projectStatus, ...props }) => {
  const { reportId } = useParams();

  const onAddProject = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [report, projects] = await Promise.all([
          snapshot.getPromise(reportAtomFamily(reportId)),
          snapshot.getPromise(statusesByColor({ reportId, color: projectStatus })),
        ]);

        const newProjectObj = { name: "", status: {} };

        const {
          data: { id: newProjectId },
        } = await addProjectStatus({
          ...newProjectObj,
          date: `${reportId}-01`,
          status_color: projectStatus,
        });

        const newProjects = {
          [newProjectId]: newProjectObj,
          ...projects,
        };
        set(statusesByColor({ reportId, color: projectStatus }), newProjects);
        set(reportAtomFamily(reportId), {
          ...report,
          projects: {
            ...report.projects,
            [projectStatus]: newProjects,
          },
        });
      },
    [projectStatus, reportId],
  );

  return (
    <Button small onClick={onAddProject} {...props}>
      Add project
    </Button>
  );
};

export const RemoveProjectButton = ({ projectStatus, id, ...props }) => {
  const { reportId } = useParams();

  const onRemoveProjectStatus = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        if (!window.confirm("Are you sure you want to remove project?")) return;

        const [report, projects] = await Promise.all([
          snapshot.getPromise(reportAtomFamily(reportId)),
          snapshot.getPromise(statusesByColor({ reportId, color: projectStatus })),
        ]);

        const { [id]: removedProject, ...remainingProjects } = projects;

        set(statusesByColor({ reportId, color: projectStatus }), remainingProjects);
        set(reportAtomFamily(reportId), {
          ...report,
          projects: {
            ...report.projects,
            [projectStatus]: remainingProjects,
          },
        });

        await removeProjectStatus(id);
      },
    [id, projectStatus],
  );

  return (
    <Button {...props} small red className="mt-1" onClick={onRemoveProjectStatus}>
      Remove
    </Button>
  );
};

const ProjectsStatusGroup = ({ projectStatus, onProjectStateChange }) => {
  const projects = useActiveReportProjectsByColor(projectStatus);
  return (
    <div>
      <h1 className="text-xl m-2">{initCap(projectStatus)}</h1>
      <AddProjectButton small className="ml-2" projectStatus={projectStatus} />
      {Object.keys(projects).map((key) => (
        <ProjectState
          key={key}
          id={key}
          onProjectStateChange={onProjectStateChange}
          projectStatus={projectStatus}
        />
      ))}
    </div>
  );
};

const ProjectGroupShell = ({ onProjectStateChange }) =>
  PROJECT_STATES_ALL.map((state) => (
    <ProjectsStatusGroup
      projectStatus={state}
      key={state}
      onProjectStateChange={onProjectStateChange}
    />
  ));

const CopyPreviousReport = ({ report, ...props }) => {
  const createNewReportState = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const {
          data: { id: newReportId },
        } = await cloneLastReport();

        const allReportsIdsValue = await snapshot.getPromise(allReportsIds);
        set(allReportsIds, [newReportId, ...allReportsIdsValue]);
      },
    [],
  );

  return (
    <Button {...props} onClick={() => createNewReportState()}>
      Add month
    </Button>
  );
};

const SaveReport = ({ data }) => (
  <Button
    value="save"
    onClick={() => {
      let element = document.createElement("a");
      let file = new Blob([JSON.stringify(data, null, 2)], {
        type: "text/plain",
      });
      element.style = "display:none";
      element.href = URL.createObjectURL(file);
      element.download = "data.json";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }}>
    Save
  </Button>
);

const EditorHideButton = ({ setPaneSize, lastSize }) => (
  <Button
    value="Edit"
    onClick={() => {
      setPaneSize(0);
      LocalStorageStore.sidebarState = {
        open: false,
        size: lastSize.current,
      };
    }}>
    Hide
  </Button>
);

export default ({ setPaneSize, lastSize, onProjectStateChange }) => {
  let activeReport = useActiveReport();

  return (
    <Scrollable>
      <div className="flex bg-gray-300 justify-between p-1">
        <h1 className="text-black font-bold p-1 truncate">Report Editor</h1>
        <div className="spaced-row-grid">
          <CopyPreviousReport report={activeReport} />
          <SaveReport data={activeReport} />
          <PrintButton />
          <EditorHideButton setPaneSize={setPaneSize} lastSize={lastSize} />
        </div>
      </div>

      <BenchEditorGroup />

      <ProjectGroupShell onProjectStateChange={onProjectStateChange} />

      <PraiseEditorGroup />
    </Scrollable>
  );
};
