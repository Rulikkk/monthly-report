const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

export const formatIdAsDate = (id) => formatter.format(Date.parse(id + "-01"));
