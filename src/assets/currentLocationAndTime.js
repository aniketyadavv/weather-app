import React, { useEffect, useState } from 'react';

const CurrentLocationAndTime = () => {
    const [location, setLocation] = useState({});
    const [localTime, setLocalTime] = useState('');
    const [region, setRegion] = useState('');

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => console.log(error)
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        };

        const getLocalTime = () => {
            const currentDate = new Date();

            // Calculate the offset for IST (UTC+5:30) in milliseconds
            const offset = 5.5 * 60 * 60 * 1000;

            // Convert UTC time to IST using the offset
            const istTime = new Date(currentDate.getTime() + offset);

            setLocalTime(istTime.toUTCString());
        };

        const getRegion = () => {
            if (location.latitude && location.longitude) {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.address && data.address.country) {
                            setRegion(data.address.country);
                        }
                    })
                    .catch((error) => console.log(error));
            }
        };

        getLocation();
        getLocalTime();
        getRegion();
    }, [location.latitude, location.longitude]);

    return (
            <p className='header'>
            <span className="home-emoji">🏡{region ? <span>{region}</span> : <span>Loading...</span>}</span>
                {localTime ? <span>{localTime}</span> : <span>Loading...</span>}
            </p>
        
    );
};

export default CurrentLocationAndTime;
