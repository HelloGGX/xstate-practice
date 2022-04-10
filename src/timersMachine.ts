import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { createTimerMachine, TimerContext } from "./timerMachine";


interface TimersContext {
    timers: ActorRefFrom<ReturnType<typeof createTimerMachine>>[]
}

type TimersEvent = { type: 'ADD', payload: number } | { type: 'TIMER.DELETE', payload: string }
const timer = new TimerContext();

export const createTimersMachine = () => createMachine<TimersContext, TimersEvent>({
    id: "timers",
    initial: "idle",
    context: {
        timers: [],
    },
    states: {
        idle: {

        },
    },
    on: {
        ADD: {
            actions: assign((ctx, e) => {
                const timerActor = spawn(createTimerMachine({ ...timer, duration: e.payload }));
                return {
                    timers: [...ctx.timers, timerActor]
                }
            }),
        },
        'TIMER.DELETE': {
            actions: assign((ctx, e) => {
                const curTimers = ctx.timers.filter((timer) => timer.id !== e.payload)
                return {
                    timers: curTimers
                };
            })
        }
    },
});