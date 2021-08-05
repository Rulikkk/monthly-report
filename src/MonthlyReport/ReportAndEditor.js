import React, { Suspense } from "react";
import Split from "react-split-pane";
import debounce from "lodash.debounce";
import Report from "./reportComponents";
import Editor from "./Editor";
import Store from "./Store";
import Spinner from "../Spinner";
import {
  Button,
  PrintButton,
  GoHomeButton,
  TopRightFixedMenu,
  useAll,
  enhanceDataInplace
} from "./BaseComponents";

/**
 * ToDO:
 * - Make reports collapsible
 * - Add MDX support
 * - Animations!
 *
 * Done:
 * - Simplify resizer logic
 * - solve header image flicker in Safari
 */

const parsedData = Store.reportJSON;
enhanceDataInplace(parsedData);

const pathname = document.location.pathname;
const activeReport = parsedData.reports.find((r) => r.code === pathname);
if (pathname.length < 3 || !activeReport) {
  // navigate("/" + parsedData.reports[parsedData.reports.length - 1].code);
}

const EditorShowButton = ({ paneSize, setPaneSize, defaultSize, lastSize }) => (
  <Button
    value="Edit"
    onClick={() => {
      let newSize = lastSize.current || defaultSize;
      setPaneSize(newSize);
      Store.sidebarState = {
        open: true,
        size: newSize
      };
    }}
  >
    {paneSize === 0 && "Edit"}
  </Button>
);

const ReportAndEditor = ({ reportId }) => {
  const initialSidebarState = Store.sidebarState,
    props = useAll({
      state: {
        paneSize: initialSidebarState.open ? initialSidebarState.size : 0
      },
      ref: {
        lastSize: initialSidebarState.size
      },
      defaultSize: initialSidebarState.size
    });
  const { data, setData, onChange } = useAll({
    state: {
      data: parsedData
    },
    callback: {
      onChange: [
        debounce((size) => {
          if (size < 50) size = 0;
          props.setPaneSize(size);
          if (size > 0) props.lastSize.current = size;
          Store.sidebarState = { open: size > 0, size };
        }, 200),
        []
      ]
    }
  });
  // useEffect(
  //   debounce(() => {
  //     Store.reportJSON = data;
  //   }, 200),
  //   [data]
  // );

  const onProjectStateChange = (project, oldState, newState) => {
    // Find current report.
    const currentReport = data.reports.find((r) => r.code === reportId);

    // Remove the project from old state list.
    const oldStateProjects = currentReport.projects[oldState];
    currentReport.projects[oldState] = oldStateProjects.filter(
      (p) => p !== project
    );

    // Add the project to new state list.
    const newStateProjects = currentReport.projects[newState];
    currentReport.projects[newState] = [project, ...newStateProjects];

    // Update the component state.
    setData({ ...data });
  };

  return (
    <Suspense fallback={<Spinner text={`Loading report ${reportId}`} />}>
      {props.paneSize === 0 && (
        <TopRightFixedMenu>
          <GoHomeButton />
          <PrintButton />
          <EditorShowButton {...props} />
        </TopRightFixedMenu>
      )}
      <Split
        split="vertical"
        minSize={0}
        maxSize={0}
        defaultSize={props.defaultSize}
        size={props.paneSize}
        primary="second"
        onChange={onChange}
      >
        <Report />
        <Editor
          data={data}
          setData={setData}
          activeReportCode={reportId}
          setPaneSize={props.setPaneSize}
          lastSize={props.lastSize}
          onProjectStateChange={onProjectStateChange}
        />
      </Split>
    </Suspense>
  );
};

export default ReportAndEditor;