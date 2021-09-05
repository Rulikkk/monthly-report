import React, { Suspense, useState } from "react"
import { Link } from "@reach/router"
import Split from "react-split-pane"
import debounce from "lodash.debounce"
import {useRecoilCallback, useRecoilState} from 'recoil'
import camelCase from "lodash.camelcase";
import {PROJECT_STATES_ALL} from '../../common/constants'
import LocalStorageStore from "../../common/localStorageStore"
import Spinner from "../../components/Spinner"
import {
  Button,
  enhanceDataInplace,
  PrintButton,
} from "../../components/pageComponents/MonthlyReport/BaseComponents"
import {allReportsIds, reportAtomFamily} from '../../store/state'
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

  const storePanelSize = (open, size) => LocalStorageStore.sidebarState = { open, size };

  const onPanelSizeChange = debounce((size) => {
    const newSize = size < MIN_PANEL_SIZE_PX ? 0 : size;
    setPanelSize(newSize);
    storePanelSize(newSize > 0, newSize);
  }, 200);

  const openPanel = () => {
    setPanelSize(DEFAULT_PANEL_SIZE_PX);
    storePanelSize(true, DEFAULT_PANEL_SIZE_PX);
  }

  const changeProjectState = useRecoilCallback(({ snapshot, set }) => async (project, oldState, newState) => {
    const currentReport = await snapshot.getPromise(reportAtomFamily(reportId));
    const projectIdCased = camelCase(project.id);

    const updatedCurrentReport = {
      ...currentReport,
      projects: PROJECT_STATES_ALL.map(state => {
        const projectStates = currentReport.projects[state]

        const projectsMap = Object.keys(projectStates).reduce((acc2, pId) => {
          if (state === oldState && pId === projectIdCased) {
            return acc2;
          }

          return {
            ...acc2,
            [pId]: projectStates[pId]
          }
        }, {});

        if (state === newState) {
          projectsMap[projectIdCased] = project;
        }

        return [state, projectsMap]
      }).reduce((acc, [state, projectsMap]) => ({
        ...acc,
        [state]: projectsMap
      }), {})
    }

    set(reportAtomFamily(reportId), updatedCurrentReport);
  }, [reportId]);

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
        onChange={onPanelSizeChange}
      >
        <ReportSection />
        <EditorSection
          setPaneSize={setPanelSize}
          lastSize={panelSize}
          onProjectStateChange={changeProjectState}
        />
      </Split>
    </Suspense>
  );
};

export default MonthlyReport;
