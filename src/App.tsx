import { useMachine } from "@xstate/react";
import React, { useEffect, useState } from "react";
import { inspect } from "@xstate/inspect";
import { createTimersMachine } from "./timersMachine";
import { Timer } from "./Timer";

// inspect({
//   iframe: false,
//   url: "https://stately.ai/viz?inspect",
// });

function App() {
  const [state, send] = useMachine(createTimersMachine());
  const { timers } = state.context;
  const [duration, setDuration] = useState(0);

  return (
    <div className="App">
      {timers.map((timer) => {
        return <Timer key={timer.id} timerActor={timer}></Timer>;
      })}
      <input
        type="number"
        placeholder="请输入时间"
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <button onClick={() => send({ type: "ADD", payload: duration })}>
        新增
      </button>
    </div>
  );
}

export default App;
