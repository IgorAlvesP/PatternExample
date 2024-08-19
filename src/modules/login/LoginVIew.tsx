import React from "react";
import LoginPresenter from "./loginPresenter";
import { Container, LoginContainer } from "./styles";
import backgroundImage from "../../assets/images/login-background.png";
import HistoryManager from "../../managers/historyManager";

type LoginViewProps = {
  presenter: LoginPresenter;
  className?: string;
  // onLoginSuccess: () => void;
};

class LoginView extends React.Component<LoginViewProps> {
  constructor(props: LoginViewProps) {
    super(props);
    this.props.presenter.forceUpdate = this.forceUpdate.bind(this);
  }

  forceUpdate() {
    this.setState({});
  }

  render() {
    const { scope } = this.props.presenter;

    return (
      <Container
        className={this.props.className}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {scope.loggingIn ? (
          <h1>{scope.loading ? <h1>Loading</h1> : <h1>Logged</h1>}</h1>
        ) : (
          <LoginContainer>
            <h1>Login</h1>
            <input
              type="text"
              placeholder="Username"
              value={scope.username}
              onChange={(e) => {
                scope.username = e.target.value;
                this.props.presenter.update();
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={scope.password}
              onChange={(e) => {
                scope.password = e.target.value;
                this.props.presenter.update();
              }}
            />
            <button
              onClick={() =>
              {
                this.props.presenter.login(scope.username, scope.password);
                alert(HistoryManager.getHistory());
              }
              }
              disabled={scope.loggingIn}
            >
              {scope.loggingIn ? "Logging in..." : "Login"}
            </button>
            {scope.loading && <p>Loading...</p>}
          </LoginContainer>
        )}
      </Container>
    );
  }
}

export default LoginView;
