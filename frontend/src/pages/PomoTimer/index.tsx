import * as React from 'react';
import { describeArc } from '../../util/arcGen';
import { useTimer } from '../../util/timer';

interface TimerSettings {
    focusTime: { length: number, occurences: number },
    shortBreakTime: { length: number, occurences: number },
    longBreakTime: { length: number, occurences: number }
}

const defaultSettings: TimerSettings = { focusTime: { length: 25, occurences: 4, }, shortBreakTime: { length: 5, occurences: 3 }, longBreakTime: { length: 15, occurences: 1 } };

const timeColors: { [key: string]: string } = {
    'focusTime': '#28D981',
    'shortBreakTime': '#2881D9',
    'longBreakTime': '#FFF'
}

const PomoTimer = () => {

    const [timerSettings, setTimerSettings] = React.useState<TimerSettings>(defaultSettings);

    const [timerStatus, setTimerStatus] = React.useState(false);

    const getTotalTime = React.useMemo(() => {
        let totalTime = 0;

        Object.values(timerSettings).forEach((setting: { length: number, occurences: number }) => {
            totalTime += setting.length * setting.occurences;
        })

        return totalTime;
    }, [timerSettings])

    const createOrderOfTimes = () => {
        let order: string[] = [];

        let totalOccurences = timerSettings['focusTime'].occurences + timerSettings['shortBreakTime'].occurences + timerSettings['longBreakTime'].occurences;

        let focusCount = 0;
        for (let i = 0; i < totalOccurences; i++) {
            if (focusCount % 4 === 0 && focusCount !== 0) {
                order.push('longBreakTime');
                focusCount = 0;
            }
            else if (i % 2 === 0) {

                order.push('focusTime');
                focusCount++;

            } else if (i % 2 !== 0) {
                order.push('shortBreakTime');
            }
        }
        // console.log(order)
        return order;
    }

    return (
        <div className='w-full h-full max-w-2xl pt-8'>
            <TimerDisplay order={createOrderOfTimes()} settings={timerSettings} totalTime={getTotalTime} timerStatus={timerStatus} />
            <div className='flex w-full flex-row justify-between gap-4'>
                <button className='flex-1 rounded-md border-2 border-[#1D2021] text-white text-2xl py-2 font-semibold' onClick={() => setTimerStatus(false)}>Stop</button>
                <button className='flex-1 rounded-md bg-long-break-glow text-white text-2xl py-2 font-semibold' onClick={() => setTimerStatus(!timerStatus)}> {timerStatus ? "Pause" : "Start"} </button>
                {/* <button className='flex-1 rounded-md bg-long-break-glow text-white text-2xl py-2 font-semibold' onClick={() => setTimerStatus(true)}>Resume</button> */}
            </div>
        </div>
    );
}

interface DisplayProps {
    order: string[],
    settings: TimerSettings,
    totalTime: number,
    timerStatus: boolean
}

const TimerDisplay = ({ order, settings, totalTime, timerStatus }: DisplayProps) => {

    const [startAngles, setStartAngles] = React.useState<number[]>([]);
    const [startTimings, setStartTimings] = React.useState<number[]>([]);
    const [time, setTime] = React.useState({ min: 0, seconds: 0 });
    const [activeSession, setActiveSession] = React.useState(0)

    const generateStartAngles = () => {
        let angles = [0];
        let totalOccurences = settings['focusTime'].occurences + settings['shortBreakTime'].occurences + settings['longBreakTime'].occurences;
        order.forEach((val) => {
            angles.push((((settings[val as keyof TimerSettings].length) / totalTime) * 100) + angles[angles.length - 1] + (65 / (totalOccurences / 4)))
        })
        setStartAngles(angles);
    }

    const generateStartTimings = () => {
        let timings = [0];

        order.forEach((val) => {
            timings.push(settings[val as keyof TimerSettings].length + timings[timings.length - 1]);
        })
        setStartTimings(timings);
    }

    React.useEffect(() => {
        generateStartAngles();
        // generateStartTimings();

    }, [])

    const getColorForTime = (time: string) => {
        return timeColors[time]
    }

    const updateTime = (mins: number, seconds: number) => {
        setTime({ min: mins, seconds: seconds });
    }

    const updateActive = (newActive: number) => {
        setActiveSession(newActive);
    }

    const getTitle = (time: string) => {
        if (time === 'focusTime') {
            return "Focus";
        } else if (time === 'shortBreakTime') {
            return "Short Break";
        } else if (time === 'longBreakTime') {
            return "Long Break";
        }
    }

    return (
        <div>
            <h1 className='text-white text-2xl text-center mb-[-2rem] md:mb-[-4rem] md:text-4xl'> {getTitle(order[activeSession])} </h1>
            <svg viewBox='0 0 200 200' xmlns="http://www.w3.org/2000/svg" className='TestAnim'>
                <defs>
                    <filter id='glow' x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur className='blur' result='coloredBlur' stdDeviation={2} />
                        <feMerge>
                            <feMergeNode in='coloredBlur' />
                            <feMergeNode in='coloredBlur' />
                            <feMergeNode in='SourceGraphic' />
                        </feMerge>
                    </filter>
                </defs>
                {/* <circle cx="100" cy="100" r="65" fill='#151718' stroke="#242627" strokeWidth={1} /> */}

                <text x="50%" y="50%" textAnchor='middle' fill='white'>
                    {/* <tspan fontSize={'1rem'} fontWeight={'400'} fontFamily='Open Sans'> {activeSession} </tspan> */}
                    <tspan dominantBaseline='middle' fontSize={'2rem'} fontWeight={'400'} fontFamily='Open Sans'>{time.min < 10 ? "0" + time.min : time.min}:{time.seconds < 10 ? "0" + time.seconds : time.seconds} </tspan>
                </text>
                {startAngles.map((val, index) => {
                    return (
                        <TimerPath
                            key={val}
                            index={index}
                            strokeColor={getColorForTime(order[index])}
                            arc={describeArc(100, 100, 65, val, startAngles[index + 1])}
                            // delay={startTimings[index] * 60}
                            duration={settings[order[index > 7 ? 0 : index] as keyof TimerSettings].length}
                            updateTime={updateTime}
                            updateActive={updateActive}
                            name={order[index]}
                            timerStatus={timerStatus}
                            active={activeSession}
                            canPlay={((activeSession) === index)}
                        />
                    );
                })}
            </svg>
        </div>
    );
}

interface TimerPathProps {
    index: number
    strokeColor: string,
    arc: string,
    duration: number,
    updateTime: (mins: number, seconds: number) => void
    updateActive: (newActive: number) => void,
    name: string,
    timerStatus: boolean,
    active: number,
    canPlay: boolean
}

const TimerPath = ({ index, strokeColor, arc, duration, updateTime, updateActive, name, timerStatus, active, canPlay }: TimerPathProps) => {

    const [currentAmount, setCurrentAmount] = React.useState(1);

    const updatePath = () => {
        let date = (new Date(currentTime.current));
        updateTime(date.getUTCMinutes(), date.getUTCSeconds());
        if (date.getMinutes() === 0 && date.getSeconds() === 0) {
            console.log("Finished Timer", duration);
            updateActive(index + 1);
            stopTimer();
            return;
        }
        // console.log("Time", date.getUTCMinutes(), date.getUTCSeconds(), date.getMilliseconds())
        setCurrentAmount((prev) => prev + ((13.9 / (duration * 60))));
    }
    const { startTimer, stopTimer, currentTime, resumeTimer } = useTimer(duration * 60000, undefined, updatePath);

    React.useEffect(() => {
        if (canPlay && timerStatus) {
            let date = (new Date(currentTime.current));
            updateTime(date.getUTCMinutes(), date.getUTCSeconds());
            startTimer();
        } else if (!timerStatus && active === index) {
            stopTimer();
        }

        return () => {
            stopTimer();
        }

    }, [timerStatus, canPlay])


    return (
        <g>
            <path
                fill='none' strokeLinecap='round' strokeLinejoin='round'
                strokeDasharray={`${15 * 408.4070449667 / 100} 408.4070449667`} stroke={strokeColor} strokeOpacity={0.3}
                strokeWidth={1} d={arc} />
            <path
                className='transition-all'
                fill='none' strokeLinecap='round' strokeLinejoin='round'
                strokeDasharray={`${(15 - currentAmount) * 408.4070449667 / 100} 408.4070449667`} stroke={Math.round(15 - currentAmount) === 0 ? undefined : strokeColor}
                strokeWidth={1} d={arc} filter="url(#glow)" />
        </g>
    );
}

export default PomoTimer;