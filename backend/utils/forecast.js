const request = require('request')

const forecast = (lat, lng, city, callback) => {
    const url = 'https://api.darksky.net/forecast/93c040ad8476d485d99fb1266f410bef/' + encodeURIComponent(lat) + ',' + encodeURIComponent(lng);
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback('Canot find the forecast', error);
        } else {
            console.log(response.body);
            callback(undefined, response.body);
        }
    })
}

module.exports = forecast;