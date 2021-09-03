import isNil from "lodash.isnil";

function migrateReportBenchInfo(report) {
  // Create an empty object with bench info.
  if (isNil(report.benchInfoData)) {
    report.benchInfoData = {
      benchSectionEnabled: true,
      info: [],
      remarks: [],
    };
  }

  // Remove old field with bench report image.
  delete report.benchImage;
}

/**
 *
 * @param {Data} reportData
 */
export function migrateOldReportData(reportData) {
  const newData = { ...reportData };
  newData.reports.forEach(migrateReportBenchInfo);
  return newData;
}
