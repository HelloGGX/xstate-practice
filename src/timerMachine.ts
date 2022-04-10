import { inspect } from "@xstate/inspect";
import { assign, createMachine, interpret, sendParent } from "xstate";
import { createClockMachine } from "./clockMachine";

export class TimerContext {
    public duration = 10;
    public elapsed = 0;
    public interval = 0.1;
}
const context = new TimerContext();

export type TimerEvent =
    | { type: "DELETE", payload: string }
    | { type: "TOGGLE" }
    | { type: "RESET" }
    | { type: "CLOCK.TICK"; payload: number };

inspect({
    iframe: false,
    url: "https://stately.ai/viz?inspect",
});



export const createTimerMachine = (props = context) =>
    createMachine<TimerContext, TimerEvent>({
        id: "timer",
        initial: "idle",
        context: { ...props },
        on: {
            DELETE: {
                actions: [
                    sendParent((_, e) => ({ type: "TIMER.DELETE", payload: e.payload })),
                ],
            },
        },
        states: {
            idle: {
                entry: assign({
                    ...props,
                }),
                on: {
                    TOGGLE: {
                        target: "running",
                    },
                },
            },
            running: {
                invoke: {
                    // 调用子状态机
                    src: (ctx) => createClockMachine(ctx),
                    onDone: {
                        target: "idle",
                    },
                },
                on: {
                    TOGGLE: {
                        target: "paused",
                    },
                    "CLOCK.TICK": {
                        actions: assign({
                            elapsed: (ctx, e) => e.payload,
                        }),
                    },
                },
            },
            paused: {
                on: {
                    TOGGLE: {
                        target: "running",
                    },
                    RESET: {
                        target: "idle",
                    },
                },
            },
        },
    });

const service = interpret(createTimerMachine(), { devTools: true }).start();


service.subscribe((state) => {
    console.log(state);
})