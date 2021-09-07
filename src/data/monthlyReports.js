import "../typedefs";

/**
 * @type {Data}
 */
const defaultData = {
  reports: [
    {
      code: "2019-01",
      name: "Jan 2019",
      projects: {
        green: [
          {
            name: "test name",
            notes: "test notes",
            staffing: "test staffing",
          },
          {
            name: "test name",
          },
          { name: "test name" },
        ],
        yellow: [
          {
            name: "test name",
            issues: [
              {
                issue: "test issue",
                mitigation: "test mitigation",
                eta: "mid may",
              },
            ],
            notes: "test notes",
            staffing: "test staffing",
          },
          {
            name: "test name",
            issues: [
              { issue: "test issue", mitigation: "test mitigation" },
              {
                issue: "test issue 2",
                mitigation: "test mitigation 2.",
                eta: "Mid-december",
              },
            ],
          },
        ],
        red: [],
        terminated: [],
      },
    },
    {
      code: "2019-02",
      name: "Feb 2019",
      projects: {
        green: [{}, {}, {}, {}, {}],
        yellow: [],
        red: [{}],
        terminated: [],
      },
    },
    {
      code: "2019-03",
      name: "March 2019",
      projects: {
        green: [{}],
        yellow: [{}],
        red: [],
        terminated: [],
      },
    },
    {
      code: "2019-04",
      name: "April 2019",
      projects: {
        green: [],
        yellow: [],
        red: [],
        terminated: [],
      },
    },
    {
      code: "2019-05",
      name: "May 2019",
      projects: {
        green: [],
        yellow: [],
        red: [],
        terminated: [],
      },
    },
    {
      code: "2019-06",
      name: "June 2019",
      projects: {
        green: [],
        yellow: [],
        red: [],
        terminated: [],
      },
    },
    {
      code: "2019-07",
      name: "July 2019",
      projects: {
        green: [],
        yellow: [],
        red: [],
        terminated: [],
      },
    },
  ],
};

export default defaultData;
