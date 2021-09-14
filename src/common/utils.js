const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

export const formatIdAsDate = (id) => formatter.format(Date.parse(id + "-01"));

export const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const getButtonColor = (color) => `bg-${color}-500 hover:bg-${color}-700 `;

export const getButtonClassName = (red, small, disabled, className) =>
  [
    "text-white font-xs px-2 rounded truncate",
    getButtonColor(red ? "red" : "blue"),
    small ? "" : "py-1",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].join(" ");
