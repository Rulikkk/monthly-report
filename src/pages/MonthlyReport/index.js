import React, { Suspense, useState } from "react"
import { Link } from "@reach/router"
import Split from "react-split-pane"
import debounce from "lodash.debounce"
import LocalStorageStore from "../../common/localStorageStore"
import Spinner from "../../components/Spinner"
import {
  Button,
  enhanceDataInplace,
  PrintButton,
} from "../../components/pageComponents/MonthlyReport/BaseComponents"
import EditorSection from "./EditorSection"
import ReportSection from "./ReportSection"

/**
 * TODO:
 * - Make reports collapsible
 * - Add MDX support
 * - Animations!
 *
 * Done:
 * - Simplify resizer logic
 * - solve header image flicker in Safari
 */

const GoHomeButton = () => (
  <Link to="/">
    <Button>Home</Button>
  </Link>
);

const EditorShowButton = ({ openPanel }) => (
  <Button
    value="Edit"
    onClick={openPanel}
  >
    Edit
  </Button>
);

const DEFAULT_PANEL_SIZE_PX = 450;
const MIN_PANEL_SIZE_PX = 150;

const MonthlyReport = ({ reportId }) => {
  const initialSidebarState = LocalStorageStore.sidebarState;
  const [panelSize, setPanelSize] = useState(initialSidebarState.open ? initialSidebarState.size : 0);
  const [data, setData] = useState(enhanceDataInplace(LocalStorageStore.reportJSON));

  const storePanelSize = (open, size) => LocalStorageStore.sidebarState = { open, size };

  const onChange = debounce((size) => {
    const newSize = size < MIN_PANEL_SIZE_PX ? 0 : size;
    setPanelSize(newSize);
    storePanelSize(newSize > 0, newSize);
  }, 200);

  const openPanel = () => {
    setPanelSize(DEFAULT_PANEL_SIZE_PX);
    storePanelSize(true, DEFAULT_PANEL_SIZE_PX);
  }

  const onProjectStateChange = (project, oldState, newState) => {
    // Find current report.
    const currentReport = data.reports.find((r) => r.code === reportId);

    // Remove the project from old state list.
    const oldStateProjects = currentReport.projects[oldState];
    currentReport.projects[oldState] = oldStateProjects.filter((p) => p !== project);

    // Add the project to new state list.
    const newStateProjects = currentReport.projects[newState];
    currentReport.projects[newState] = [project, ...newStateProjects];

    // Update the component state.
    setData({ ...data });
  };

  return (
    <Suspense fallback={<Spinner text={`Loading report ${reportId}`} />}>
      {panelSize === 0 && (
        <div className="fixed top-0 right-0 z-50 no-print p-1 rounded-bl spaced-row-grid">
          <GoHomeButton />
          <PrintButton />
          <EditorShowButton openPanel={openPanel} />
        </div>
      )}
      <Split
        split="vertical"
        minSize={0}
        maxSize={0}
        defaultSize={DEFAULT_PANEL_SIZE_PX}
        size={panelSize}
        primary="second"
        onChange={onChange}
      >
        <ReportSection />
        <EditorSection
          setPaneSize={setPanelSize}
          lastSize={panelSize}
          onProjectStateChange={onProjectStateChange}
        />
      </Split>
    </Suspense>
  );
};

export default MonthlyReport;
