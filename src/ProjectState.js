import './typedef'

import React from 'react';

import { PROJECT_STATES_ALL } from "./const";

import ProjectStateMoveToStateSelect from "./ProjectStateMoveToStateSelect";

import {
    Input,
    AddRemoveNotesButton,
    AddRemoveIssueButton,
    AddRemoveStaffingButton,
    RemoveProjectButton,
    Issue,
} from './Editor';

/**
 * 
 * @param {Object} obj - props.
 * @param {string} obj.forState - the state of the project.
 * @param {Project} obj.project - the project to display.
 * @param {*} obj.updateReport
 * @param {*} obj.projects
 */
const ProjectState = ({ forState, project, updateReport, projects }) => (
    <div className="m-2 p-2 rounded border shadow-lg">
        <Input
            className="font-bold"
            value={project.name}
            placeholder="Project Name"
            afterChange={updateReport}
            onChange={val => (project.name = val)}
        />
        <div className="flex justify-end">
            <AddRemoveIssueButton project={project} updateReport={updateReport} />
            <AddRemoveNotesButton project={project} updateReport={updateReport} />
            <AddRemoveStaffingButton project={project} updateReport={updateReport} />
            <RemoveProjectButton
                project={project}
                projects={projects}
                updateReport={updateReport}
            />
        </div>
        <div className="flex justify-end">
            <span>Move to: <ProjectStateMoveToStateSelect allStates={PROJECT_STATES_ALL} currentState={forState} /></span>
        </div>
        {project.issues &&
            project.issues.map((issue, i) => (
                <Issue key={issue.id || i} issue={issue} updateReport={updateReport} />
            ))}
        <div>
            {project.notes !== undefined && (
                <>
                    Notes
            <Input
                        value={project.notes}
                        afterChange={updateReport}
                        onChange={val => (project.notes = val)}
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
                        afterChange={updateReport}
                        onChange={val => (project.staffing = val)}
                        placeholder="Add staffing info here"
                        textarea
                    />
                </>
            )}
        </div>
    </div>
);

export default ProjectState;