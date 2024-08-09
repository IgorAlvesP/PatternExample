class LoginScope {
  private __changed = false;
  get changed() {
    return this.__changed;
  }
  set changed(value: boolean) {
    this.__changed = value;
  }

  private __username = "";
  private __password = "";
  private __loggingIn = false;
  private __loading = false;

  get loading() {
    return this.__loading;
  }
  set loading(value: boolean) {
    if (this.__loading !== value) {
      this.__loading = value;
      this.__changed = true;
    }
  }

  get loggingIn() {
    return this.__loggingIn;
  }
  set loggingIn(value: boolean) {
    if (this.__loggingIn !== value) {
      this.__loggingIn = value;
      this.__changed = true;
    }
  }

  get username() {
    return this.__username;
  }
  set username(value: string) {
    if (this.__username !== value) {
      this.__username = value;
      this.__changed = true;
    }
  }

  get password() {
    return this.__password;
  }
  set password(value: string) {
    if (this.__password !== value) {
      this.__password = value;
      this.__changed = true;
    }
  }

  logout() {
    this.loggingIn = false;
    this.username = "";
    this.password = "";
  }
}

export default LoginScope;
