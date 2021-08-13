import React, { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import { Button, getRandomId, PrintButton } from "./BaseComponents";
import BenchEditorGroup from "./BenchEditorGroup";
import { PROJECT_STATES_ALL } from "./const";
import { PraiseEditorGroup } from "./Praises";
import ProjectState from "./ProjectState";
import { Scrollable } from "./Scrollable";
import Store from "./Store";
import { useActiveReport, useSetProjectsByColor } from "./store/hooks";
import { useSetRecoilState } from "recoil";
import { reportQuery } from "./store/state";

const initCap = (s) => [s[0].toUpperCase(), ...s.slice(1)].join("");

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const Input = ({
  value,
  onChange,
  afterChange,
  textarea = false,
  className = "",
  ...otherProps
}) => {
  const [state, setState] = useState(value),
    handleChange = ({ target: { value } }) => {
      setState(value);
      onChange && onChange(value);
      afterChange && afterChange();
    },
    props = {
      ...otherProps,
      className:
        "shadow w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
        className,
      value: state,
      onChange: handleChange
    };

  return textarea ? (
    <TextareaAutosize {...props} />
  ) : (
    <input type="text" {...props} />
  );
};

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

export const AddRemoveNotesButton = ({ project, setProject }) => {
  let has = project.notes !== undefined;
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          has &&
          project.notes.length > 0 &&
          !inIframe() &&
          !window.confirm("Are you sure you want to remove notes?")
        )
          return;
        if (has) {
          const { notes, ...rest } = project;
          setProject(rest);
        } else setProject({ ...project, notes: "" });
      }}
    >
      <input type="checkbox" checked={has} readOnly /> notes
    </Button>
  );
};

export const AddRemoveStaffingButton = ({ project, setProject }) => {
  const has = project.staffing !== undefined;
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          has &&
          project.staffing.length > 0 &&
          !inIframe() &&
          !window.confirm("Are you sure you want to remove staffing?")
        )
          return;
        if (has) {
          const { staffing, ...rest } = project;
          setProject(rest);
        } else {
          setProject({ ...project, staffing: "" });
        }
      }}
    >
      <input type="checkbox" checked={has} readOnly /> staffing
    </Button>
  );
};

export const AddRemoveIssueButton = ({ project, setProject }) => {
  const hasIssues = !!(project.issues && project.issues.length > 0);
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          hasIssues &&
          !inIframe() &&
          !window.confirm("Are you sure you want to remove issue?")
        )
          return;
        if (hasIssues) {
          const { issues, ...rest } = project;
          setProject(rest);
        } else {
          setProject({
            ...project,
            issues: [{ issue: "", mitigation: "", eta: "" }]
          });
        }
      }}
    >
      <input type="checkbox" checked={hasIssues} readOnly /> issue
    </Button>
  );
};

const AddProjectButton = ({ projects, setProjects, ...props }) => {
  return (
    <Button
      small
      onClick={() => {
        setProjects([{ name: "" }, ...projects]);
      }}
      {...props}
    >
      Add project
    </Button>
  );
};

export const RemoveProjectButton = ({
  projects,
  setProjects,
  index,
  ...props
}) => {
  return (
    <Button
      {...props}
      small
      red
      className="mt-1"
      onClick={() => {
        if (
          !inIframe() &&
          !window.confirm("Are you sure you want to remove project?")
        )
          return;
        const newProjects = [...projects];
        newProjects.splice(index, 1);
        setProjects(newProjects);
      }}
    >
      Remove
    </Button>
  );
};

const ProjectGroup = ({ forState, onProjectStateChange }) => {
  const [projects, setProjects] = useSetProjectsByColor(forState);
  const props = { projects, setProjects };
  return (
    <div>
      <h1 className="text-xl m-2">{initCap(forState)}</h1>
      <AddProjectButton small className="ml-2" {...props} />
      {projects.map((p, i) => (
        <ProjectState
          forState={forState}
          key={p.id || i}
          index={i}
          onProjectStateChange={onProjectStateChange}
          {...props}
        />
      ))}
    </div>
  );
};

const ProjectGroupShell = ({ onProjectStateChange }) =>
  PROJECT_STATES_ALL.map((state) => (
    <ProjectGroup
      forState={state}
      key={state}
      onProjectStateChange={onProjectStateChange}
    />
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
  "Dec"
];

const getNextCodeAndName = (lastCode) => {
  let [year, month] = lastCode.split("-").map((x) => parseInt(x, 10));
  if (month < 12) month++;
  else [year, month] = [year + 1, 1];
  return [
    `${year}-${month.toString().padStart(2, "0")}`,
    `${MONTH_NAMES[month - 1]} ${year}`
  ];
};

const CopyPreviousReport = ({ report, ...props }) => {
  let setReport = useSetRecoilState(reportQuery(report.reportId));

  return (
    <Button
      {...props}
      onClick={async () => {
        if (!report) {
          alert("No reports to copy, please, load initial data.");
          return;
        }
        // const lastReport = data.reports[data.reports.length - 1],
        //   [code, name] = getNextCodeAndName(lastReport.code),
        //   newReport = { ...lastReport, prev: lastReport, code, name };
        // lastReport.next = newReport;
        // data.reports.push(newReport);
        // incrementLoadId(data);
        // setData(data);
        // Store.reportJSON = data;
        try {
          // await push("report", {date: report.reportId, ...report});
          if (!inIframe())
            alert(
              `${report.reportId} report was copied from previous month. Page will be reloaded.`
            );
          window.location.reload();
        } catch (err) {
          toast.error({ ...err });
        }
      }}
    >
      Add month
    </Button>
  );
};

const OpenReport = () => {
  let setReport = useSetRecoilState(reportQuery());
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async () => {
      // Do whatever you want with the file contents
      try {
        const { reportId, benchInfoData, projects, ...data } = JSON.parse(
          reader.result
        );
        setReport({
          ...data,
          date: reportId,
          benchInfo: benchInfoData,
          projects: Object.keys(projects).reduce(
            (acc, k) => [...acc, projects[k]],
            []
          )
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
    accept: "application/json"
  });

  return (
    <div
      className="text-white font-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 cursor-pointer select-none"
      title="Click or drop JSON here"
      {...getRootProps()}
    >
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
        type: "text/plain"
      });
      element.style = "display:none";
      element.href = URL.createObjectURL(file);
      element.download = "data.json";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }}
  >
    Save
  </Button>
);

const EditorHideButton = ({ setPaneSize, lastSize }) => (
  <Button
    value="Edit"
    onClick={() => {
      setPaneSize(0);
      Store.sidebarState = {
        open: false,
        size: lastSize.current
      };
    }}
  >
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

      <BenchEditorGroup report={activeReport} />

      <ProjectGroupShell onProjectStateChange={onProjectStateChange} />

      <PraiseEditorGroup report={activeReport} />
    </Scrollable>
  );
};
