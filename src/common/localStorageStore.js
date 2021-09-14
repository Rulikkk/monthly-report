const serializeFilter = (key, value) => {
  if (key === "next" || key === "prev" || key === "enhanced") return undefined;
  return value;
};

export default class LocalStorageStore {
  static SIDEBAR_STATE_KEY = "SidebarPositionKey";

  static getJsonVal(name, defaultValue) {
    const val = localStorage.getItem(name);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (err) {
        console.error(`Failed reading "${name}" key from LocalStorage, returning default value`);
      }
    }
    return defaultValue;
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
}