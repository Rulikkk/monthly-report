import React from 'react';

/**
 * A state change callback.
 *
 * @callback stateChangeCallback
 * @param {string} oldState - an old state.
 * @param {string} newState - a new state.
 */
/**
 * 
 * @param {Object} obj - props.
 * @param {string} obj.allStates - a list of all states.
 * @param {string} obj.currentState - a current state.
 * @param {stateChangeCallback} obj.onStateChange - a state change callback.
 */
const ProjectStateMoveToStateSelect = ({ allStates, currentState, onStateChange }) => {
    const onChangeHandler = event => {
        const newState = event.target.value;
        onStateChange && onStateChange(currentState, newState);
    };
    return (
        <select value={currentState} onChange={onChangeHandler}>
            {allStates && allStates.map(state => (
                <option value={state} key={state}>
                    {state}
                </option>
            ))}
        </select>
    );
};

export default ProjectStateMoveToStateSelect;