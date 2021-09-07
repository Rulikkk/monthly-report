import "../../typedefs";

import React from "react";
import { PROJECT_STATES_ALL } from "../../common/constants";
import ProjectStateMoveToStateSelect from "./ProjectStateMoveToStateSelect";

import {
  AddRemoveNotesButton,
  AddRemoveIssueButton,
  AddRemoveStaffingButton,
  RemoveProjectButton,
  Issue,
} from "./EditorSection";
import {
  EditorShadowedCard,
  Input,
} from "../../components/pageComponents/MonthlyReport/BaseComponents";
import { useProjectStatusById } from "../../store/hooks";

/**
 * A project state change callback.
 * @callback projectStateChangeCallback
 * @param {Project} project - a project that was moved.
 * @param {string} oldState - an old project state.
 * @param {string} newState - a new project state.
 */
/**
 *
 * @param {Object} obj - props.
 * @param {string} obj.forState - the state of the project.
 * @param {Project} obj.project - the project to display.
 * @param {*} obj.updateReport
 * @param {*} obj.projects
 * @param {projectStateChangeCallback} obj.onProjectStateChange - a project state change callback.
 */
const ProjectState = ({ forState, id, onProjectStateChange, ...projects }) => {
  const [project, setProject] = useProjectStatusById(forState, id);
  const props = { project, setProject };
  return (
    <EditorShadowedCard>
      <Input
        className="font-bold"
        value={project.name}
        placeholder="Project Name"
        onChange={(val) => setProject({ ...project, name: val })}
      />
      <div className="flex justify-end">
        <AddRemoveIssueButton {...props} />
        <AddRemoveNotesButton {...props} />
        <AddRemoveStaffingButton {...props} />
        <RemoveProjectButton id={id} forState={forState} {...projects} />
      </div>
      <div className="flex justify-end py-1">
        <span>
          Move to:{" "}
          <ProjectStateMoveToStateSelect
            allStates={PROJECT_STATES_ALL}
            currentState={forState}
            onStateChange={(oldState, newState) =>
              onProjectStateChange && onProjectStateChange(project, oldState, newState)
            }
          />
        </span>
      </div>
      {project.issues &&
        project.issues.map((issue, i) => (
          <Issue
            key={i}
            issue={issue}
            setIssue={(issue) => {
              const issues = [...project.issues];
              issues[i] = issue;
              setProject({ ...project, issues });
            }}
          />
        ))}
      <div>
        {project.notes !== undefined && (
          <>
            Notes
            <Input
              value={project.notes}
              onChange={(val) => setProject({ ...project, notes: val })}
              placeholder="Add notes here"
              textarea
            />
          </>
        )}
        {project.staffing !== undefined && (
          <>
            Staffing
            <Input
              value={project.staffing}
              onChange={(val) => setProject({ ...project, staffing: val })}
              placeholder="Add staffing info here"
              textarea
            />
          </>
        )}
      </div>
    </EditorShadowedCard>
  );
};

export default ProjectState;
