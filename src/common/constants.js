const GREEN = "green";
const YELLOW = "yellow";
const RED = "red";
const TERMINATED = "terminated";
const PROJECT_STATES = [GREEN, YELLOW, RED];
const PROJECT_STATES_ALL = [TERMINATED, ...PROJECT_STATES.reverse()];

export { GREEN, YELLOW, RED, TERMINATED, PROJECT_STATES, PROJECT_STATES_ALL };
