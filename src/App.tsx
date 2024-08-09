import React from "react";
import GlobalStyle from "./AppStye";
import MainView from "./components/view/main";
import MainPresenter from "./presenters/main";
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
