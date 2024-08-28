import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ChatPresenter } from "./chatPresenter";
import { ChatContainer, Container } from './style';

interface ChatViewProps {
  presenter: ChatPresenter;
}

const ChatView: React.FC<ChatViewProps> = ({ presenter }) => {
  const [input, setInput] = useState(presenter.getInput());

  useEffect(() => {
    presenter.forceUpdate = () => {
      setInput(presenter.getInput());
    };

    return () => {
      presenter.forceUpdate = () => {};
    };
  }, [presenter]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    presenter.handleInputChange(newInput);
  };

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    presenter.handleSend();
    setInput('');
  };

  const messages = presenter.getMessages();

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
          onChange={handleInputChange}
          style={{ flex: 1, marginRight: "10px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </Container>
  );
};

export default ChatView;
