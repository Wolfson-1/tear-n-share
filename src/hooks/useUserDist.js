import { useEffect, useState } from "react";

// function to filter users within distance range
export default function useUserDist(location, distance, distanceUnit, users) {    
    
    // set earth radius to either M or KM based on distanceUnit preference
    const R = distanceUnit === 'M' ? 3963.1 : 6378;

    //init array for filtered list of users by distance 
    const [returnUsers,setReturnUsers] = useState([]);

    //function to calculate distances between other users & logged in user.
    const userDistances = () => {
        let filteredArr = [];
        
        //logic to return if nessicary data does not exist yet
        if(location === undefined || !location) return;
        
        // convert current logged in user lat/long to radions
        const latRad = location.lat * Math.PI/180;
        const lngRad = location.lng * Math.PI/180;

        //loop through users array for filtering based on distance paramaters
        users.forEach(user => {

            //convert user in list lat/long to radions
            const lat2Rad = user.location.lat * Math.PI/180;
            const lng2Rad = user.location.lng * Math.PI/180;
            
            // distance between user & logged in user lat/long calcs 
            const dlat = lat2Rad - latRad;
            const dlng = lng2Rad - lngRad;

            //Haversine formula to calculate distance
            const a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(latRad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlng/2),2);
            const c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
            const d = c * R; // Distance from user in either miles or KM

            // logic to push user into returnUsers if withihn logged in users distance parameters.
            if (d < distance && d !== 0) filteredArr.push({...user,distToUser:d});
    });

    setReturnUsers(filteredArr);
    };

    useEffect(() => {
        userDistances();
    },[location,distance,distanceUnit]);
    
    return returnUsers;
}