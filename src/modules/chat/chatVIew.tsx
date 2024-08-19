// src/components/ChatView.tsx

import React, { ChangeEvent, MouseEvent } from "react";
import { ChatPresenter } from "./chatPresenter";
import { ChatContainer, Container } from './style'

interface ChatViewProps {
  presenter: ChatPresenter;
}

export default class ChatView extends React.Component<ChatViewProps> {
  constructor(props: ChatViewProps) {
    super(props);
    this.props.presenter.forceUpdate = this.forceUpdate.bind(this);
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    this.props.presenter.handleInputChange(input);
  };

  handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.presenter.handleSend();
  };

  render() {
    const { presenter } = this.props;
    const messages = presenter.getMessages();
    const input = presenter.getInput();

    return (
      <Container>
        <h1>Chat</h1>
        <ChatContainer>
          {messages.map((msg, index) => (
            <p key={index} style={{ margin: "5px 0" }}>
              {msg}
            </p>
          ))}
        </ChatContainer>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={this.handleInputChange}
            style={{ flex: 1, marginRight: "10px" }}
          />
          <button onClick={this.handleSend}>Send</button>
        </div>
      </Container>
    );
  }
}
