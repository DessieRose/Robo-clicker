import { useState, useEffect, useRef } from 'react';

const Clicks = ({ clickCount }) => {
    const [clicksPerSecond, setClicksPerSecond] = useState(0);
    const timestamps = useRef([]);

    useEffect(() => {
        const now = Date.now();
        timestamps.current = timestamps.current.filter(t => now - t < 1000);
        timestamps.current.push(now);
        setClicksPerSecond(timestamps.current.length);
    }, [clickCount]);

    // This effect is optional and can be used to clean up old timestamps periodically
    
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const now = Date.now();
    //         timestamps.current = timestamps.current.filter(t => now - t < 1000);
    //         setClicksPerSecond(timestamps.current.length);
    //     }, 200);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="clicks">
            <p>{clicksPerSecond} Clicks/s</p>
        </div>
    );
};

export default Clicks;