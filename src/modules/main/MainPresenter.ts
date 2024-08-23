import MainScope from "./MainScope";
import HistoryManager from "../../managers/historyManager";

export default class MainPresenter {
  public historyManager = new HistoryManager(this);
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
    this.syncViewWithUrl();
  }

  public syncViewWithUrl() {
    const view = HistoryManager.getCurrentView();
    HistoryManager.push(`/${view}`);
  }

  onOpenDashboard = () => {
    HistoryManager.push("/dashboard");
  };

  onOpenLogin = () => {
    HistoryManager.push("/login");
  };

  onOpenChats = () => {
    HistoryManager.push("/chat");
  };

  onOpenSettings = () => {
    HistoryManager.push("/settings");
  };

  onOpenCounter = () => {
    HistoryManager.push("/counter");
  };

  onOpenInvalid = () => {
    HistoryManager.push("/invalid");
  };
}