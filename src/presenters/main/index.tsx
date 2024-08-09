import Chat from "../../components/view/chat";
import CounterView from "../../components/view/counter/CounterView";
import Dashboard from "../../components/view/dashboard";
import LoginView from "../../components/view/login";
import Settings from "../../components/view/settings";
import MainScope from "../../models/main";
import { ChatPresenter } from "../chat";
import { CounterPresenter } from "../counter/CounterPresenter";
import LoginPresenter from "../login";

class HashHistoryManager {
  private history: string[] = [];
  private historyListener: () => void = () => {};

  push(url: string) {
    this.history.push(url);
    window.history.pushState(null, "", url);
    this.historyListener();
    console.log(`Navigated to: ${url}`);
  }

  getUrl(): string {
    return this.history[this.history.length - 1] || "/";
  }

  listen(listener: () => void) {
    this.historyListener = listener;
  }
}

class UpdateManager {
  private updateCallback: () => void;
  private beforeUpdateCallback: () => void;

  constructor(updateCallback: () => void, beforeUpdateCallback: () => void) {
    this.updateCallback = updateCallback;
    this.beforeUpdateCallback = beforeUpdateCallback;
  }

  push(scope: MainScope) {
    this.beforeUpdateCallback();
    this.updateCallback();
  }
}

export default class MainPresenter {
  private counterPresenter = new CounterPresenter();
  private loginPresenter = new LoginPresenter();
  private chatPresenter = new ChatPresenter();
  public readonly scope = new MainScope();
  private historyManager = new HashHistoryManager();
  private updateManager = new UpdateManager(
    () => this.forceUpdate(),
    this.onBeforeUpdate.bind(this)
  );

  constructor() {
    this.historyManager.listen(() => this.handleHistoryChange());
    this.syncViewWithUrl();
  }

  forceUpdate = () => {};

  update() {
    if (this.scope.changed) {
      this.scope.changed = false;
      this.updateManager.push(this.scope);
    }
  }

  onBeforeUpdate() {
    console.log("Preparing to update...");
  }

  handleHistoryChange() {
    const url = window.location.pathname;
    console.log(`History changed to: ${url}`);
    this.syncViewWithUrl();
  }

  private syncViewWithUrl() {
    const path = window.location.pathname;
    switch (path) {
      case "/dashboard":
        this.scope.setView("dashboard");
        this.scope.setBody(<Dashboard />);
        this.update();
        break;
      case "/login":
        this.scope.setView("login");
        this.scope.setBody(<LoginView presenter={this.loginPresenter} />);
        this.update();
        break;
      case "/chats":
        this.scope.setView("chat");
        this.scope.setBody(<Chat presenter={this.chatPresenter} />);
        this.update();
        break;
      case "/settings":
        this.scope.setView("settings");
        this.scope.setBody(<Settings />);
        this.update();
        break;
      case "/counter":
        this.scope.setView("counter");
        this.scope.setBody(<CounterView presenter={this.counterPresenter} />);
        this.update();
        break;
      default:
        this.update();
        break;
    }
  }

  onOpenDashboard = () => {
    this.scope.setView("dashboard");
    this.update();
    this.historyManager.push("/dashboard");
  };

  openLogin = () => {
    this.scope.setView("login");
    this.scope.setBody(<LoginView presenter={this.loginPresenter} />);
    this.update();
    this.historyManager.push("/login");
  };

  onOpenChats = () => {
    this.scope.setView("chats");
    this.update();
    this.historyManager.push("/chats");
  };

  openSettings = () => {
    this.scope.setView("settings");
    this.update();
    this.historyManager.push("/settings");
  };

  onOpenCounter = () => {
    this.scope.setView("counter");
    this.scope.setBody(<CounterView presenter={this.counterPresenter} />);
    this.update();
    this.historyManager.push("/counter");
  };

  onOpenInvalid = () => {
    this.scope.setView("invalid");
    this.update();
    this.historyManager.push("/invalid");
  };
}
