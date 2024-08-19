import MainPresenter from "../modules/main/MainPresenter";

class HistoryManager {
  private static history: string[] = [];
  private static historyListener: () => void = () => {};

  agora é preciso compor os estados para refletir na url

  static push(url: string, presenter: MainPresenter) {
    const currentUrl = this.getUrl();

    if (currentUrl === url) {
      return;
    }

    if (this.history.length > 0) {
      this.flip(currentUrl + url, presenter);
    } else {
      this.history.push(url);
      this.flip(url, presenter);
    }

    this.historyListener();
  }

  static getUrl(): string {
    return this.history[this.history.length - 1] || "/";
  }

  static getHistory(): string[] {
    return this.history;
  }

  static clearHistory(presenter: MainPresenter) {
    this.history = [];
    this.push("/dashboard", presenter);
  }


  static listen(listener: () => void) {
    this.historyListener = listener;
  }

  static flip(name: string, presenter: MainPresenter) {
    const formattedName = name.startsWith("/") ? name : `/${name}`;
    presenter.scope.setView(formattedName.replace("/", ""));
    presenter.scope.setBody(formattedName.replace("/", ""));
    presenter.update();
    window.history.pushState(null, "", formattedName);
  }

  static removeLast(url: string) {
    url = url.replace("/", "");
    if (this.history[this.history.length - 1] === url) {
      this.history.pop();
    }
  }
}

export default HistoryManager;
