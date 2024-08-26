import React, { useEffect, useState } from 'react';
import DashBoardPresenter from './DashBoardPresenter';
import SettingsView from '../settings/SettingsView';
import { ChatPresenter } from '../chat/chatPresenter';
import HistoryManager from '../../managers/historyManager';
import ChatView from '../chat/chatVIew';
import CounterView from '../counter/CounterView';
import { CounterPresenter } from '../counter/counterPresenter';

type DashBoardViewProps = {
  presenter: DashBoardPresenter;
};

const viewComponents: Record<string, React.ReactNode> = {
  chat: <ChatView presenter={new ChatPresenter()} />,
  settings: <SettingsView />,
  dashboard: <div> Welcome </div>,
  counter: <CounterView presenter={new CounterPresenter()}/>,
  invalid: <div>Invalid Viewasd</div>,
};

const DashBoardView: React.FC<DashBoardViewProps> = ({ presenter }) => {
  const [currentView, setCurrentView] = useState<React.ReactNode>(viewComponents.dashboard);

  useEffect(() => {
    const updateView = () => {
      const view = HistoryManager.getCurrentView();
      setCurrentView(viewComponents[view] || viewComponents.invalid);
    };

    HistoryManager.listen(updateView);
    updateView();
    
    return () => {
      HistoryManager.listen(() => {}); 
    };
  }, [presenter]);

  return (
    <div>
      <button onClick={presenter.onOpenChats}>Chats</button>
      <button onClick={ presenter.onOpenSettings}>Settings</button>
      <button onClick={presenter.onOpenCounter}>Counter</button>
      <button onClick={() => {
        localStorage.setItem("isAuthenticated", "false");
        window.location.reload();
      }}>Logout</button>

      <div>{currentView}</div>
    </div>
  );
};

export default DashBoardView;