import React, { useEffect, useState } from "react";
import MainPresenter from "./MainPresenter";
import Dashboard from "../dashboard/DashBoardView";
import HistoryManager from "../../managers/historyManager";
import DashBoardPresenter from "../dashboard/DashBoardPresenter";
import InvalidView from "../invalid/InvalidVIew";
type MainViewProps = {
  presenter: MainPresenter;
};

const viewComponents: Record<string, React.ReactNode> = {
  dashboard: <Dashboard presenter={new DashBoardPresenter()} />,
  invalid: <InvalidView />,
};

const MainView: React.FC<MainViewProps> = ({ presenter }) => {
  const [currentView, setCurrentView] = useState<React.ReactNode>(viewComponents.dashboard);

  useEffect(() => {
    alert('eeu mudei')
    const updateView = () => {
      const view = HistoryManager.getCurrentView();
      alert(view);
      setCurrentView(viewComponents[view] || viewComponents.invalid);
    };
  
    presenter.notifyView = updateView;
    updateView();
  }, [presenter]);

  return (
      <div>{currentView}</div>
  );
};

export default MainView;
