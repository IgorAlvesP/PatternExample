export default class MainScope {
  scope: string = "dashboard";
  bodyContent: string = "dashboard";
  changed: boolean = false;

  setView(view: string) {
    if (this.scope !== view) {
      this.scope = view;
      this.changed = true;
    }
  }

  setBody(content: string) {
    if (this.bodyContent !== content) {
      this.bodyContent = content;
      this.changed = true;
    }
  }

  hasChanged(): boolean {
    const changed = this.changed;
    this.changed = false;
    return changed;
  }
}
