export default class ChatScope {
  private messages: string[] = [];
  private input: string = "";

  setInput(input: string) {
    this.input = input;
  }

  getInput() {
    return this.input;
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }

  clearInput() {
    this.input = "";
  }
}
