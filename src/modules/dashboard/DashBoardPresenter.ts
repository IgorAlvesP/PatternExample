import HistoryManager from "../../managers/historyManager";

class DashBoardPresenter {
  onOpenLogin = () => {
    HistoryManager.push("/login");
  };

  onOpenChats = () => {
    HistoryManager.push("/chat");
  };

  onOpenSettings = () => {
    HistoryManager.push("/settings");
  };

  onOpenCounter = () => {
    HistoryManager.push("/counter");
  };
}

export default DashBoardPresenter;