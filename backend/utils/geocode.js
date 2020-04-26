const request = require('request');
const geocode = (street, city, state, callback) => {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(street) + ",+" + encodeURIComponent(city) + ",+" + encodeURIComponent(state) +"&key=AIzaSyBdi9cfvj4UG4R18oaWz1S5ReFPjuVvdKk";
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback("Unable to connect to location service.", undefined);
        } else if (response.body.results.length === 0) {
            callback("Unable to find location.", undefined);
        } else {
            callback(undefined, {
                lat: response.body.results[0].geometry.location.lat,
                lng: response.body.results[0].geometry.location.lng
            });
        }
    });
}

module.exports = geocode;