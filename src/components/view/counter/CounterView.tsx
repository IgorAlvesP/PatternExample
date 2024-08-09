import React from "react";
import { CounterPresenter } from "../../../presenters/counter/CounterPresenter";

type CounterViewProps = {
  presenter: CounterPresenter;
};

class CounterView extends React.Component<CounterViewProps> {
  constructor(props: CounterViewProps) {
    super(props);
    this.props.presenter.forceUpdate = this.forceUpdate.bind(this);
  }

  render() {
    const { count } = this.props.presenter.scope;

    return (
      <div>
        <h2>Counter View</h2>
        <p>Count: {count}</p>
        <button onClick={() => this.props.presenter.increment()}>
          Increment
        </button>
        <button onClick={() => this.props.presenter.decrement()}>
          Decrement
        </button>
      </div>
    );
  }
}

export default CounterView;
