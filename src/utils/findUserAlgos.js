// function to filter users within distance range
export function userDistanceFilter(lat, lng, distanceInKm, users) {    
    // earths radius in km
    const R = 6373;

    // convert current logged in user lat/long to radions
    const latRad = lat * Math.PI/180;
    const lngRad = lng * Math.PI/180;

    //init array for filtered list of users by distance 
    let returnUsers = [];

    //loop through users array for filtering based on distance paramaters
    users.forEach(user => {
                //convert user in list lat/long to radions
                const lat2Rad = user.lat * Math.PI/180;
                const lng2Rad = user.long * Math.PI/180;
                
                // distance between user & logged in user lat/long calcs 
                const dlat = lat2Rad - latRad;
                const dlng = lng2Rad - lngRad;

                //Haversine formula to calculate distance
                const a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(latRad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlng/2),2);
                const c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
                const d = c * R; // Distance from user in km
        
                if (d < distanceInKm) returnUsers.push(user);        
    });

    return returnUsers;  
}