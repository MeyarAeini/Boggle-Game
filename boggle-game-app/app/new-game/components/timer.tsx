'use client';
import { useState, useEffect } from "react"
export default function Timer() {
    const [timer, setTimer] = useState({ seconds: 0, minutes: 0, hours: 0 });
    useEffect(() => {
        setInterval(() => {
            setTimer(prev => {
                const s = prev.seconds + 1;
                if (s === 60) {
                    const m = prev.minutes + 1;
                    if (m === 60)
                        return { seconds: 0, minutes: 0, hours: prev.hours + 1 };
                    return { ...prev, seconds: 0, minutes: m };
                }
                return { ...prev, seconds: s };
            });
        }, 1000);
    }, []);
    return (
        <div>
            Time Elapsed : {`${timer.hours.toString().padStart(2, '0')}:${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`}
        </div>
    )
}