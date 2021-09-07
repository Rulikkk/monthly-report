/**
 * @typedef Data
 * @property {Report[]} reports
 */

/**
 * @typedef BenchInfoData
 * @property {boolean} benchSectionEnabled
 * @property {BenchInfoRecord[]} info
 * @property {*[]} remarks
 */

/**
 * @typedef BenchInfoRecord
 * @property {string} id
 * @property {string} caption
 * @property {string} count
 * @property {string} info
 */

/**
 * @typedef Report
 * @property {string} code
 * @property {string} name
 * @property {ProjectsDict} projects
 * @property {string} benchImage
 * @property {BenchInfoData} benchInfoData
 */

/**
 * @typedef ProjectsDict
 * @property {Project[]} green
 * @property {Project[]} yellow
 * @property {Project[]} red
 * @property {Project[]} terminated
 */

/**
 * @typedef Project
 * @property {string} id
 * @property {string} name
 * @property {string} notes
 * @property {string} staffing
 * @property {*} issues
 */
