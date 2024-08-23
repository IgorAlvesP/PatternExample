import HistoryManager from "../../managers/historyManager";
import LoginScope from "./loginScope";

class LoginPresenter {
  public readonly scope = new LoginScope();

  public forceUpdate(): void {}
  public switchPage(): void {}

  async login(userName: string, password: string) {
    this.setLoadingState(true);
  
    const isAuthenticated = await this.authenticate(userName, password);
  
    this.setLoadingState(false);
  
    if (isAuthenticated) {
      this.scope.loggingIn = true;
      localStorage.setItem("isAuthenticated", "true"); 
      HistoryManager.push("/dashboard");
      this.switchPage();
    } else {
      this.scope.loggingIn = false;
      alert("Login failed");
    }
  
  
  }

  private setLoadingState(isLoading: boolean) {
    this.scope.loggingIn = isLoading;
    this.scope.loading = isLoading;
    this.scope.changed = true;
    this.update();
  }

  private authenticate(userName: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userName === "jose@gmail.com" && password === "12345");
      }, 2000);
    });
  }

  public update() {
    if (this.scope.changed) {
      this.scope.changed = false;
      this.forceUpdate();
    }
  }
}
export default LoginPresenter;
