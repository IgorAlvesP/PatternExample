import MainPresenter from "../modules/main/MainPresenter";


class HistoryManager {
  private static history: string[] = [];
  private static historyListener: () => void = () => {};
  private static mainPresenter: MainPresenter;
  private static  root: string;
  constructor(mainPresenter: MainPresenter) {
    HistoryManager.mainPresenter = mainPresenter;
  }

  static getMainRoute(): string {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return isAuthenticated ? "/dashboard" : "/login";
  }

  // implementar a questão de retornar com o botao back do navegador

  static push(url: string) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    

    if (!isAuthenticated && url !== "/login") {
      url = "/login";
    }


    const currentUrl = this.getUrl();
    if (currentUrl === url) {
      return;
    }
    
    if(this.root !== "login" && url.replace('/', '') !== this.root){
      this.history.push(this.root+url);
    }


    this.flip(url);

    if(this.root !== url.replace("/", "")){
      window.history.pushState(null, "", this.root+url);
    }
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
      this.setRoot("login");
      return "login";
    }
    this.setRoot(mainRoute);

    const viewKey = url.split("/").pop() || mainRoute;
    return viewKey;
}
static getRoot(){
  return this.root;
}

static setRoot(root: string){
  this.root = root;
}
  
}

export default HistoryManager;
