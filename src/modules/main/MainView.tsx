import React, { useEffect, useState } from "react";
import MainPresenter from "./MainPresenter";
import CounterView from "../counter/CounterView";
import Dashboard from "../dashboard/DashBoardView";
import LoginView from "../login/LoginVIew";
import ChatView from "../chat/chatVIew";
import Settings from "../settings/SettingsVIew";
import LoginPresenter from "../login/loginPresenter";
import { ChatPresenter } from "../chat/chatPresenter";
import { CounterPresenter } from "../counter/counterPresenter";
import HistoryManager from "../../managers/historyManager";
import InvalidView from "../invalid/InvalidVIew";

type MainViewProps = {
  presenter: MainPresenter;
};

const viewComponents: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  login: <LoginView presenter={new LoginPresenter()} />,
  chat: <ChatView presenter={new ChatPresenter()} />,
  settings: <Settings />,
  counter: <CounterView presenter={new CounterPresenter()} />,
  invalid: <InvalidView />,
  logged: <div>u'r authenticate</div>,
};

const MainView: React.FC<MainViewProps> = ({ presenter }) => {
  const [currentView, setCurrentView] = useState<React.ReactNode>(viewComponents.dashboard);

  useEffect(() => {
    const updateView = () => {
      const view = HistoryManager.getCurrentView();
      setCurrentView(viewComponents[view] || viewComponents.invalid);
    };
  
    presenter.notifyView = updateView;
    updateView();
  }, [presenter]);

  return (
    <div>
      <button onClick={presenter.onOpenDashboard}>Dashboard</button>
      <button onClick={presenter.onOpenLogin}>Login</button>
      <button onClick={presenter.onOpenChats}>Chats</button>
      <button onClick={presenter.onOpenSettings}>Settings</button>
      <button onClick={presenter.onOpenCounter}>Counter</button>
      <button onClick={() => {
        localStorage.setItem("isAuthenticated", "false");
        window.location.reload();
      }}>Logout</button>
      <div>{currentView}</div>
    </div>
  );
};

export default MainView;
