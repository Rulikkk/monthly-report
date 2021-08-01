import { atom } from "recoil";
import { ACTIVE_REPORT_ID } from "./keys";

export let activeReportIdData = atom({
  key: ACTIVE_REPORT_ID,
  default: null
});
