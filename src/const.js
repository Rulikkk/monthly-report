const GREEN = "green",
  YELLOW = "yellow",
  RED = "red",
  TERMINATED = "terminated",
  PROJECT_STATES = [GREEN, YELLOW, RED],
  PROJECT_STATES_ALL = [TERMINATED, ...[...PROJECT_STATES].reverse()];

export { GREEN, YELLOW, RED, TERMINATED, PROJECT_STATES, PROJECT_STATES_ALL };
