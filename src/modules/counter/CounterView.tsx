import React, { useEffect, useState } from "react";
import { CounterPresenter } from "./counterPresenter";

type CounterViewProps = {
  presenter: CounterPresenter;
};

const CounterView: React.FC<CounterViewProps> = ({ presenter }) => {
  const [count, setCount] = useState(presenter.scope.count);

  useEffect(() => {
    presenter.forceUpdate = () => {
      setCount(presenter.scope.count);
    };

    return () => {
      presenter.forceUpdate = () => {};
    };
  }, [presenter]);

  const handleIncrement = () => {
    presenter.increment();
  };

  const handleDecrement = () => {
    presenter.decrement();
  };

  return (
    <div>
      <h2>Counter View</h2>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default CounterView;
