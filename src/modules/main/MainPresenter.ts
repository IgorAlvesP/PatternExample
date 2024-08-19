import MainScope from "./MainScope";
import HistoryManager from "../../managers/historyManager";

export default class MainPresenter {
  public historyManager = new HistoryManager();
  public readonly scope = new MainScope();


  constructor() {
    window.addEventListener("popstate", () => this.handleHistoryChange());
    this.syncViewWithUrl();
  }

  update() {
    if (this.scope.hasChanged()) {
      this.notifyView();
    }
  }

  notifyView() {}

  handleHistoryChange() {
    const url = window.location.pathname;
    HistoryManager.removeLast(url);
    this.syncViewWithUrl();
  }

  public syncViewWithUrl() {
    const path = window.location.pathname;
    HistoryManager.push(path, this);
    console.log("syncViewWithUrl", HistoryManager.getHistory());
  }

  onOpenDashboard = () => {
    HistoryManager.clearHistory(this);
  };

  onOpenLogin = () => {
    HistoryManager.push("/login", this);
  };

  onOpenChats = () => {
    HistoryManager.push("/chat", this);
  };

  onOpenSettings = () => {
    HistoryManager.push("/settings", this);
  };

  onOpenCounter = () => {
    HistoryManager.push("/counter", this);
  };

  onOpenInvalid = () => {
    HistoryManager.push("/invalid", this);
  };
}
