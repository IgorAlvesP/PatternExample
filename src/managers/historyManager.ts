import MainPresenter from "../modules/main/MainPresenter";


class HistoryManager {
  private static history: string[] = [];
  private static historyListener: () => void = () => {};
  private static mainPresenter: MainPresenter;

  constructor(mainPresenter: MainPresenter) {
    HistoryManager.mainPresenter = mainPresenter;
  }

  static getMainRoute(): string {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return isAuthenticated ? "/dashboard" : "/login";
  }

  static push(url: string) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";


    if (!isAuthenticated && url !== "/login") {
      url = "/login";
    }

    console.log("push", url);
    console.log('this.history', this.history);

    const currentUrl = this.getUrl();
    if (currentUrl === url) {
      return;
    }

      this.history.push(url);
      this.flip(url);

    this.historyListener();
    HistoryManager.mainPresenter.update();
  }

  static getUrl(): string {
    return this.history[this.history.length - 1] || "/";
  }

  static getHistory(): string[] {
    return this.history;
  }

  static clearHistory() {
    this.history = [];
    this.push(this.getMainRoute());
  }

  static listen(listener: () => void) {
    this.historyListener = listener;
  }

  static flip(name: string) {
    const formattedName = name.startsWith("/") ? name : `/${name}`;
    HistoryManager.mainPresenter.scope.setView(formattedName.replace("/", ""));
    HistoryManager.mainPresenter.scope.setBody(formattedName.replace("/", ""));
    HistoryManager.mainPresenter.update();
    window.history.pushState(null, "", formattedName);
  }

  static flipToSaved() {
    this.clearHistory();
  }

  static removeLast(url: string) {
    url = url.replace("/", "");
    if (this.history[this.history.length - 1] === url) {
      this.history.pop();
    }
  }

  static getCurrentView() {
    const url = this.getUrl();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const mainRoute = isAuthenticated ? "dashboard" : "login";
    
    if (!isAuthenticated && url !== "/login") {
      return "login";
    }

    const viewKey = url.split("/").pop() || mainRoute;
    return viewKey;
  }
}

export default HistoryManager;
