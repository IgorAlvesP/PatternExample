import React from "react";
import MainPresenter from "../../../presenters/main";
import MainScope from "../../../models/main";

type MainViewProps = {
  presenter: MainPresenter;
};

const InvalidView: React.FC = () => {
  return <div>Invalid View</div>;
};

function viewslots(scope: MainScope) {
  switch (scope.scope) {
    case "dashboard":
      return scope.body;
    case "chat":
      return scope.body;
    case "settings":
      return scope.body;
    case "login":
      return scope.body;
    case "counter":
      return scope.body;
    default:
      return <InvalidView />;
  }
}

export default class MainView extends React.Component<MainViewProps> {
  constructor(props: MainViewProps) {
    super(props);
    this.props.presenter.forceUpdate = this.forceUpdate.bind(this);
  }

  render() {
    const { scope } = this.props.presenter;
    return (
      <div>
        <button onClick={this.props.presenter.onOpenDashboard}>
          Dashboard
        </button>
        <button onClick={this.props.presenter.openLogin}>Login</button>
        <button onClick={this.props.presenter.onOpenChats}>Chats</button>
        <button onClick={this.props.presenter.openSettings}>Settings</button>
        <button onClick={this.props.presenter.onOpenCounter}>Counter</button>
        <div>{viewslots(scope)}</div>
      </div>
    );
  }
}
