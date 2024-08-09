// src/presenters/ChatPresenter.ts

import ChatScope from "../../models/chat";

export class ChatPresenter {
  public readonly scope = new ChatScope();
  public forceUpdate: () => void = () => {};

  handleInputChange(input: string) {
    this.scope.setInput(input);
    this.forceUpdate();
  }

  handleSend() {
    const input = this.scope.getInput();
    if (input.trim()) {
      this.scope.addMessage(input);
      this.scope.clearInput();
      this.forceUpdate();
    }
  }

  getMessages() {
    return this.scope.getMessages();
  }

  getInput() {
    return this.scope.getInput();
  }
}
