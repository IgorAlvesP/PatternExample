import MainPresenter from "../modules/main/MainPresenter";

class HistoryManager {
  private static history: string[] = [];
  private static historyListener: () => void = () => {};

  agora é preciso encontrar uma forma de fazer com que o HistoryManager seja capaz de atualizar o MainPresenter, 
  de forma que o MainPresenter possa atualizar a MainView. Para isso, você deve implementar um método que permita 
  que o HistoryManager seja capaz de receber um MainPresenter e atualizá-lo. Para isso, você deve implementar 
  um método estático chamado push que recebe uma string e um MainPresenter. Esse método deve adicionar a 
  string ao histórico e chamar o método flip, passando a string e o MainPresenter como argumentos. 
  O método flip deve atualizar o MainPresenter e o MainView de acordo com a string passada como argumento.
   Além disso, você deve implementar um método estático chamado getUrl que retorna a última string adicionada 
   ao histórico. Por fim, você deve implementar um método estático chamado getHistory que retorna o histórico 
   completo. Para isso, você deve implementar um método estático chamado push que recebe uma string e um 
   MainPresenter. Esse método deve adicionar a string ao histórico e chamar o método flip, passando a string e o
    MainPresenter como argumentos. O método flip deve atualizar o MainPresenter e o MainView de acordo com a string passada como argumento. 
    Além disso, você deve implementar um método estático chamado getUrl que retorna a última string adicionada ao histórico. Por 
    fim, você deve implementar um método estático chamado getHistory que retorna o histórico completo.
  exemplo ele deve retornar a url do local porém ele deve distinguir entre a url da pagina e a url do estado do historico
  
  static push(url: string, presenter: MainPresenter) {
    this.history.push(url);
    this.historyListener();
    this.flip(url, presenter);
  }

  static getUrl(): string {
    return this.history[this.history.length - 1] || "/";
  }

  static getHistory(): string[] {
    return this.history;
  }

  static listen(listener: () => void) {
    this.historyListener = listener;
  }

  static flip(name: string, presenter: MainPresenter) {
    presenter.scope.setView(name.replace("/", ""));
    presenter.scope.setBody(name.replace("/", ""));
    presenter.update();
    window.history.pushState(null, "", name);
    console.log("history", this.history);
  }

  static removeLast(url: string) {
    url = url.replace("/", "");
    if (this.history[this.history.length - 1] === url) {
      this.history.pop();
    }
  }
}

export default HistoryManager;
