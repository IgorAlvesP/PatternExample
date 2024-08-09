export default class MainScope {
  scope: string = "dashboard";
  body: React.ReactNode = (<div>Select a view</div>);
  changed: boolean = false;

  setView(view: string) {
    if (this.scope !== view) {
      this.scope = view;
      this.changed = true;
    }
  }

  setBody(content: React.ReactNode) {
    this.body = content;
    this.changed = true;
  }
}
