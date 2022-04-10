import { assign, createMachine, sendParent } from "xstate";

class ClockContext {
    public duration = 10;
    public elapsed = 0;
    public interval = 0.1;
}

const ClockProps = new ClockContext()

export const createClockMachine = ({ elapsed, interval, duration } = ClockProps) => createMachine<ClockContext>({
    id: "clock",
    initial: "normal",
    context: {
        elapsed,
        interval,
        duration
    },
    invoke: {
        src: (ctx, event) => (sendBack, onReceive) => {
            const interval = setInterval(() => {
                sendBack("TICK");
            }, ctx.interval * 1000);
            return () => clearInterval(interval);
        },
    },
    on: {
        TICK: {
            actions: [assign({
                elapsed: (ctx, event) => ctx.elapsed + ctx.interval,
            }),
            sendParent((ctx) => ({ type: 'CLOCK.TICK', payload: ctx.elapsed }))
            ],
            cond: (ctx) => ctx.duration > ctx.elapsed
        }
    },
    states: {
        normal: {
            always: {
                target: "overTime",
                cond: (ctx) => ctx.duration <= ctx.elapsed,
            },
        },
        overTime: {
            type: "final",
        },
    },
});