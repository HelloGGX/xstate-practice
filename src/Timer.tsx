import { useActor } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { createTimerMachine } from "./timerMachine";

interface TimerProps {
  timerActor: ActorRefFrom<ReturnType<typeof createTimerMachine>>;
}

export const Timer: React.FC<TimerProps> = (props) => {
  const { timerActor } = props;

  const [state, send] = useActor(timerActor);
  const { duration, elapsed } = state.context;

  return (
    <div>
      {Math.ceil(duration - elapsed)}
      <button onClick={() => send({ type: "TOGGLE" })}>
        {state.matches("running") ? "暂停" : "开始"}
      </button>
      {state.matches("paused") && (
        <button onClick={() => send({ type: "RESET" })}>还原</button>
      )}
      <button onClick={() => send({ type: "DELETE", payload: timerActor.id })}>
        删除
      </button>
    </div>
  );
};
