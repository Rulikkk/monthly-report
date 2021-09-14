import React from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { useSetRecoilState, useRecoilCallback } from "recoil";

import {
  Button,
  getRandomId,
  PrintButton,
  Input,
} from "../../components/pageComponents/MonthlyReport/BaseComponents";
import BenchEditorGroup from "../../components/pageComponents/MonthlyReport/Bench/BenchEditorGroup";
import { PROJECT_STATES_ALL } from "../../common/constants";
import { PraiseEditorGroup } from "../../components/pageComponents/MonthlyReport/Praises";
import { cloneLastReport } from "../../store/api";
import ProjectState from "./ProjectState";
import Scrollable from "../../components/Scrollable";
import LocalStorageStore from "../../common/localStorageStore";
import { useActiveReport, useSetProjectsByColor } from "../../store/hooks";
import { allReportsIds, reportAtomFamily } from "../../store/state";
import { inIframe } from "../../common/utils";

const initCap = (s) => [s[0].toUpperCase(), ...s.slice(1)].join("");

export const Issue = ({ issue, setIssue }) => {
  return (
    <div className="border-l-2 my-4 pl-1">
      Issue
      <Input
        value={issue.issue}
        onChange={(val) => {
          setIssue({ ...issue, issue: val });
        }}
        placeholder="Describe issue here"
        textarea
      />
      <br />
      Mitigation
      <Input
        value={issue.mitigation}
        onChange={(val) => setIssue({ ...issue, mitigation: val })}
        placeholder="Add issue mitigation here"
        textarea
      />
      ETA
      <Input
        value={issue.eta}
        onChange={(val) => setIssue({ ...issue, eta: val })}
        placeholder="Add issue fix ETA here"
      />
      <br />
    </div>
  );
};

const AddProjectButton = ({ forState, projects, setProjects, ...props }) => {
  const { reportId } = useParams();
  const setReport = useSetRecoilState(reportAtomFamily(reportId));

  return (
    <Button
      small
      onClick={() => {
        const newProjects = {
          [getRandomId()]: { name: "" },
          ...projects,
        };
        setProjects(newProjects);
        setReport((report) => ({
          ...report,
          projects: {
            ...report.projects,
            [forState]: newProjects,
          },
        }));
      }}
      {...props}>
      Add project
    </Button>
  );
};

export const RemoveProjectButton = ({ forState, projects, setProjects, id, ...props }) => {
  const { reportId } = useParams();
  const setReport = useSetRecoilState(reportAtomFamily(reportId));
  return (
    <Button
      {...props}
      small
      red
      className="mt-1"
      onClick={() => {
        if (!inIframe() && !window.confirm("Are you sure you want to remove project?")) return;
        const { [id]: removedProject, ...remainingProjects } = projects;
        setProjects(remainingProjects);
        setReport((report) => ({
          ...report,
          projects: {
            ...report.projects,
            [forState]: remainingProjects,
          },
        }));
      }}>
      Remove
    </Button>
  );
};

const ProjectGroup = ({ forState, onProjectStateChange }) => {
  const [projects, setProjects] = useSetProjectsByColor(forState);
  const props = { forState, projects, setProjects };
  return (
    <div>
      <h1 className="text-xl m-2">{initCap(forState)}</h1>
      <AddProjectButton small className="ml-2" {...props} />
      {Object.keys(projects).map((key) => (
        <ProjectState key={key} id={key} onProjectStateChange={onProjectStateChange} {...props} />
      ))}
    </div>
  );
};

const ProjectGroupShell = ({ onProjectStateChange }) =>
  PROJECT_STATES_ALL.map((state) => (
    <ProjectGroup forState={state} key={state} onProjectStateChange={onProjectStateChange} />
  ));

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

const OpenReport = () => {
  let setReport = useSetRecoilState(reportAtomFamily());
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async () => {
      // Do whatever you want with the file contents
      try {
        const { reportId, benchInfoData, projects, ...data } = JSON.parse(reader.result);
        setReport({
          ...data,
          date: reportId,
          benchInfo: benchInfoData,
          projects: Object.keys(projects).reduce((acc, k) => [...acc, projects[k]], []),
        });
      } catch (e) {
        window.alert(`Could not parse file with error ${e}.`);
      }
    };
    if (acceptedFiles.length > 1) {
      window.alert(`Only support one file.`);
      return;
    }
    acceptedFiles.forEach((file) => reader.readAsText(file, ""));
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "application/json",
  });

  return (
    <div
      className="text-white font-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 cursor-pointer select-none"
      title="Click or drop JSON here"
      {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>DROP</p> : <p>Open</p>}
    </div>
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
          {/* <OpenReport setData={setData} /> */}
          <SaveReport data={activeReport} />
          <PrintButton />
          <EditorHideButton setPaneSize={setPaneSize} lastSize={lastSize} />
        </div>
      </div>

      <BenchEditorGroup />

      <ProjectGroupShell onProjectStateChange={onProjectStateChange} />

      <PraiseEditorGroup report={activeReport} />
    </Scrollable>
  );
};
