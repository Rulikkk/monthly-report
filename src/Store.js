import data from "./data";

const serializeFilter = (key, value) => {
  if (key === "next" || key === "prev" || key === "enhanced") return undefined;
  return value;
};

export default class Store {
  static SIDEBAR_STATE_KEY = "SidebarPositionKey";
  static LOCAL_STORAGE_KEY = "LocalStorageReport";
  static LAST_SELECTED_REPORT_KEY = "LastSelectedReport";
  static JSON_REPORT = "JsonReport";

  static getJsonVal(name, defaultValue) {
    let val = localStorage.getItem(name);
    return val ? JSON.parse(val) : defaultValue;
  }

  static setJsonVal(name, val, serializer) {
    localStorage.setItem(name, JSON.stringify(val, serializer));
  }

  static get sidebarState() {
    return this.getJsonVal(this.SIDEBAR_STATE_KEY, { size: 450, open: false });
  }

  static set sidebarState(value) {
    this.setJsonVal(this.SIDEBAR_STATE_KEY, value);
  }

  static get reportJSON() {
    return this.getJsonVal(this.JSON_REPORT, data);
  }

  static set reportJSON(value) {
    this.setJsonVal(this.JSON_REPORT, value, serializeFilter);
  }
}
