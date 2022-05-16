import { useRef, useState } from "react"

export function useTimer(duration: number = 0, interval: number = 1000, callback?: Function, condition?: boolean) {
    const currentTime = useRef(duration);
    const timerStore = useRef<number | null>(null);

    let expected = 0;

    const startTimer = () => {
        expected = Date.now() + interval;
        // console.log("Elapsed", duration, start)
        timerStore.current = setTimeout(timerStep, 0);
    }

    const stopTimer = () => {
        console.log("Timer stopped")
        if (timerStore.current) {
            clearTimeout(timerStore.current);
            timerStore.current = null;
        }
    }

    const pauseTimer = () => {
        stopTimer();
    }

    const resumeTimer = () => {
        expected = Date.now() + interval;
        timerStore.current = setTimeout(timerStep, interval);
    }

    const timerStep = () => {
        if (currentTime.current > -1) {
            let drift = Date.now() - expected;
            if (drift > interval) {
                console.log("Return")
                return;
            }

            if (callback) {
                callback();
            }
            currentTime.current -= interval;
            // console.log(new Date(elapsedTime).getSeconds())
            // console.log(elapsedTime)

            expected += interval;
            timerStore.current = setTimeout(timerStep, Math.max(0, interval - drift));
        }

    }

    return { startTimer, stopTimer, currentTime, pauseTimer, resumeTimer }

}