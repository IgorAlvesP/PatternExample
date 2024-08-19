import React from "react";
import GlobalStyle from "./AppStye";
import MainView from "./modules/main/MainView";
import MainPresenter from "./modules/main/MainPresenter";
const presenter = new MainPresenter();
class App extends React.Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <MainView presenter={presenter} />
      </>
    );
  }
}

export default App;
