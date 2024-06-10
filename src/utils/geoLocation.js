    // getLatLong promise to retreive lat long before API fetch
    export default () => new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const location = {
                lat:position.coords.latitude,
                lng:position.coords.longitude
              };
              resolve(location);
            },
            err => reject(err)
            );
        }
      );