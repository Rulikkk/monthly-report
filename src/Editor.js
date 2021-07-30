import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import TextareaAutosize from "react-autosize-textarea";
import { PROJECT_STATES_ALL } from "./const";
import Store from "./Store";
import {
  Button,
  getRandomId,
  PrintButton,
  enhanceDataInplace
} from "./BaseComponents";
import { Scrollable } from "./Scrollable";
import { migrateOldReportData } from "./UpdateReportVersion";
import ProjectState from "./ProjectState";
import BenchEditorGroup from "./BenchEditorGroup";
import { PraiseEditorGroup } from "./Praises";

const VALIDATION_CODE = "ARBUZ";

const initCap = (s) => [s[0].toUpperCase(), ...s.slice(1)].join("");

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

  // Update the state value if props value has been changed. Sometimes they can be out of sync.
  useEffect(() => {
    setState(value);
  }, [value]);

  return textarea ? (
    <TextareaAutosize {...props} />
  ) : (
    <input type="text" {...props} />
  );
};

export const Issue = ({ issue, updateReport }) => {
  return (
    <div className="border-l-2 my-4 pl-1">
      Issue
      <Input
        value={issue.issue}
        afterChange={updateReport}
        onChange={(val) => (issue.issue = val)}
        placeholder="Describe issue here"
        textarea
      />
      <br />
      Mitigation
      <Input
        value={issue.mitigation}
        afterChange={updateReport}
        onChange={(val) => (issue.mitigation = val)}
        placeholder="Add issue mitigation here"
        textarea
      />
      ETA
      <Input
        value={issue.eta}
        afterChange={updateReport}
        onChange={(val) => (issue.eta = val)}
        placeholder="Add issue fix ETA here"
      />
      <br />
    </div>
  );
};

export const AddRemoveNotesButton = ({ project, updateReport }) => {
  const has = project.notes !== undefined;
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          has &&
          project.notes.length > 0 &&
          !window.confirm("Are you sure you want to remove notes?")
        )
          return;
        if (has) delete project.notes;
        else project.notes = "";
        updateReport();
      }}
    >
      <input type="checkbox" checked={has} readOnly /> notes
    </Button>
  );
};

export const AddRemoveStaffingButton = ({ project, updateReport }) => {
  const has = project.staffing !== undefined;
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          has &&
          project.staffing.length > 0 &&
          !window.confirm("Are you sure you want to remove staffing?")
        )
          return;
        if (has) delete project.staffing;
        else project.staffing = "";
        updateReport();
      }}
    >
      <input type="checkbox" checked={has} readOnly /> staffing
    </Button>
  );
};

export const AddRemoveIssueButton = ({ project, updateReport }) => {
  const hasIssues = !!(project.issues && project.issues.length > 0);
  return (
    <Button
      small
      className="mt-1 mr-1"
      onClick={() => {
        if (
          hasIssues &&
          !window.confirm("Are you sure you want to remove issue?")
        )
          return;
        project.issues = hasIssues
          ? null
          : [{ id: getRandomId(), issue: "", mitigation: "", eta: "" }];
        updateReport();
      }}
    >
      <input type="checkbox" checked={hasIssues} readOnly /> issue
    </Button>
  );
};

const AddProjectButton = ({ projects, updateReport, ...props }) => {
  return (
    <Button
      {...props}
      small
      onClick={() => {
        projects.unshift({ id: getRandomId(), name: "" });
        updateReport();
      }}
    >
      Add project
    </Button>
  );
};

export const RemoveProjectButton = ({
  project,
  projects,
  updateReport,
  ...props
}) => {
  return (
    <Button
      {...props}
      small
      red
      className="mt-1"
      onClick={() => {
        if (!window.confirm("Are you sure you want to remove project?")) return;
        const index = projects.indexOf(project);
        if (index < 0) return;
        projects.splice(index, 1);
        updateReport();
      }}
    >
      Remove
    </Button>
  );
};

const ProjectGroup = ({
  forState,
  projects,
  updateReport,
  onProjectStateChange
}) => (
  <div>
    <h1 className="text-xl m-2">{initCap(forState)}</h1>
    <AddProjectButton
      small
      className="ml-2"
      projects={projects}
      updateReport={updateReport}
    />
    {projects &&
      projects.map((p, i) => (
        <ProjectState
          project={p}
          projects={projects}
          forState={forState}
          key={p.id || i}
          updateReport={updateReport}
          onProjectStateChange={onProjectStateChange}
        />
      ))}
  </div>
);

const ProjectGroupShell = ({ report, updateReport, onProjectStateChange }) =>
  PROJECT_STATES_ALL.map((state) => (
    <ProjectGroup
      forState={state}
      key={state}
      projects={report.projects[state]}
      updateReport={updateReport}
      onProjectStateChange={onProjectStateChange}
    />
  ));

const incrementLoadId = (data) => {
  if (!data.loadId) {
    data.loadId = 0;
  }
  data.loadId = (data.loadId + 1) % 1001;
};

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

const CopyPreviousReport = ({ data, setData, ...props }) => (
  <Button
    {...props}
    onClick={() => {
      if (
        !data ||
        !data.reports ||
        !data.reports.length ||
        data.reports.length === 0
      ) {
        alert("No reports to copy, please, load initial data.");
        return;
      }
      const lastReport = data.reports[data.reports.length - 1],
        [code, name] = getNextCodeAndName(lastReport.code),
        newReport = { ...lastReport, prev: lastReport, code, name };
      lastReport.next = newReport;
      data.reports.push(newReport);
      incrementLoadId(data);
      setData(data);
      Store.reportJSON = data;
      alert(
        `${name} report was copied from previous month. Page will be reloaded.`
      );
      window.location.reload();
    }}
  >
    Add month
  </Button>
);

const OpenReport = () => {
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      try {
        const loadedData = JSON.parse(reader.result);
        enhanceDataInplace(loadedData);
        if (loadedData.validationCode !== VALIDATION_CODE)
          throw new Error("Invalid validation code in json.");
        if (!window.confirm("Replace current report with loaded data?")) return;
        incrementLoadId(loadedData);

        // Upgrade report to the latest format version.
        const upgradedReportData = migrateOldReportData(loadedData);

        Store.reportJSON = upgradedReportData;
        window.location.reload();
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
      data.validationCode = VALIDATION_CODE;
      Store.reportJSON = data;
      const element = document.createElement("a"),
        file = new Blob([JSON.stringify(Store.reportJSON, null, 2)], {
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

export default ({
  data,
  setData,
  activeReportCode,
  setPaneSize,
  lastSize,
  onProjectStateChange
}) => {
  const activeReport = data.reports.find((r) => r.code === activeReportCode),
    updateReport = () => {
      console.log(data);
      setData({ ...data });
    };

  console.log("ACTIVE REPORT IN EDITOR");
  console.log(activeReport);

  return activeReport.benchInfoData === undefined ? (
    "Loading"
  ) : (
    <Scrollable>
      <div className="flex bg-gray-300 justify-between p-1">
        <h1 className="text-black font-bold p-1 truncate">Report Editor</h1>
        <div className="spaced-row-grid">
          <CopyPreviousReport data={data} setData={setData} />
          <OpenReport setData={setData} />
          <SaveReport data={data} />
          <PrintButton />
          <EditorHideButton setPaneSize={setPaneSize} lastSize={lastSize} />
        </div>
      </div>

      <BenchEditorGroup report={activeReport} updateReport={updateReport} />

      <ProjectGroupShell
        key={data.loadId}
        report={activeReport}
        updateReport={updateReport}
        onProjectStateChange={onProjectStateChange}
      />

      <PraiseEditorGroup report={activeReport} updateReport={updateReport} />
    </Scrollable>
  );
};
