import "../../typedefs";

import React, { useCallback } from "react";
import { PROJECT_STATES_ALL } from "../../common/constants";
import { updateProjectStatus } from "../../store/api";
import ProjectStateMoveToStateSelect from "./ProjectStateMoveToStateSelect";

import { RemoveProjectButton, Issue } from "./EditorSection";
import {
  EditorShadowedCard,
  Input,
} from "../../components/pageComponents/MonthlyReport/BaseComponents";
import { Checkbox } from "../../components";
import { useProjectStatusById } from "../../store/hooks";
import debounce from "lodash.debounce";
import set from "lodash.set";
import unset from "lodash.unset";
import isNil from "lodash.isnil";

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
const ProjectState = ({ projectStatus, id, onProjectStateChange }) => {
  const [project, setProject] = useProjectStatusById(projectStatus, id);

  const saveProjectChange = useCallback(
    debounce(async (payload) => {
      await updateProjectStatus(id, payload);
    }, 300),
    [id],
  );

  const onProjectChange = async (updatedProject, projectField) => {
    setProject(updatedProject);
    saveProjectChange({ [projectField]: updatedProject[projectField] });
  };

  const onStatusCheckboxUpdate = useCallback(
    (checked, label, statusObjField, initialValue) => {
      if (!checked && !window.confirm(`Are you sure you want to remove ${label}?`)) {
        return;
      }

      const clonedProject = { ...project, status: { ...project.status } };
      const projectField = `status.${statusObjField}`;
      if (checked) {
        set(clonedProject, projectField, initialValue);
      } else {
        unset(clonedProject, projectField);
      }
      onProjectChange(clonedProject, "status");
    },
    [onProjectChange],
  );

  return (
    <EditorShadowedCard>
      <Input
        className="font-bold"
        value={project.name || ""}
        placeholder="Project Name"
        onChange={(val) => onProjectChange({ ...project, name: val }, "name")}
      />
      <div className="flex justify-end">
        <Checkbox
          label="issue"
          checked={!isNil(project.status.issues)}
          onChange={(checked) =>
            onStatusCheckboxUpdate(checked, "issues", "issues", [
              { issue: "", mitigation: "", eta: "" },
            ])
          }
        />
        <Checkbox
          label="notes"
          checked={!isNil(project.status.notes)}
          onChange={(checked) => onStatusCheckboxUpdate(checked, "notes", "notes", "")}
        />
        <Checkbox
          label="staffing"
          checked={!isNil(project.status.staffing)}
          onChange={(checked) => onStatusCheckboxUpdate(checked, "staffing", "staffing", "")}
        />
        <RemoveProjectButton id={id} projectStatus={projectStatus} />
      </div>
      <div className="flex justify-end py-1">
        <span>
          Move to:{" "}
          <ProjectStateMoveToStateSelect
            allStates={PROJECT_STATES_ALL}
            currentState={projectStatus}
            onStateChange={(oldState, newState) =>
              onProjectStateChange && onProjectStateChange(project, oldState, newState)
            }
          />
        </span>
      </div>
      {!isNil(project.status.issues) &&
        project.status.issues.map((issue, i) => (
          <Issue
            key={i}
            issue={issue}
            setIssue={(issue) => {
              const issues = [...project.status.issues];
              issues[i] = issue;
              onProjectChange({ ...project, status: { ...project.status, issues } }, "status");
            }}
          />
        ))}
      <div>
        {!isNil(project.status.notes) && (
          <>
            Notes
            <Input
              value={project.status.notes}
              onChange={(val) =>
                onProjectChange({ ...project, status: { ...project.status, notes: val } }, "status")
              }
              placeholder="Add notes here"
              textarea
            />
          </>
        )}
        {!isNil(project.status.staffing) && (
          <>
            Staffing
            <Input
              value={project.status.staffing}
              onChange={(val) =>
                onProjectChange(
                  { ...project, status: { ...project.status, staffing: val } },
                  "status",
                )
              }
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
