const express = require('express');
const request = require('request');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const forecast = (lat, lng, city, state, callback) => {
    const url = 'https://api.darksky.net/forecast/93c040ad8476d485d99fb1266f410bef/' + encodeURIComponent(lat) + ',' + encodeURIComponent(lng);
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback('Canot find the forecast', error);
        } else {
            callback(undefined, response.body);
        }
    })
}

const geocode = (street, city, state, callback) => {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(street) + ",+" + encodeURIComponent(city) + ",+" + encodeURIComponent(state) +"&key=AIzaSyBdi9cfvj4UG4R18oaWz1S5ReFPjuVvdKk";
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback("Unable to connect to location service.", undefined);
        } else if (response.body.results.length === 0) {
            console.log("zero results");
            callback("Unable to find location.", {
                lat: null, 
                lng: null
            });
        } else {
            callback(undefined, {
                lat: response.body.results[0].geometry.location.lat,
                lng: response.body.results[0].geometry.location.lng
            });
        }
    });
}

const getStateSeal = (state, callback) => {
    const url = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(state) + '%20State%20Seal&cx=011369209319933728799:muvolp8tihf&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyCwZnCsIBzYOgCMp2lVJwurkrM-7BiNHI8';
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback('Canot find the forecast', error);
        } else {
            callback(undefined, response.body);
        }
    })
}

app.use('/getForecast', (req, res, next) => {
    forecast(req.query.lat, req.query.lng, req.query.city, req.query.state, (error, response) => {
        if (error) {
            return res.send({error});
        }
        res.send({
            forecast: response, 
            lat: req.query.lat, 
            lng: req.query.lng, 
            city: req.query.city, 
            state: req.query.state
        })
    })
})

app.use('/getStateSeal', (req, res, next) => {
    getStateSeal(req.query.state, (error, sealData) => {
        if (error) {
            return res.send({error});
        }
        res.send({
            sealData: sealData
        })
    })
})

const getWeekly = (lat, lng, time, callback) => {
    const url = 'https://api.darksky.net/forecast/93c040ad8476d485d99fb1266f410bef/' + encodeURIComponent(lat) + ',' + encodeURIComponent(lng)+ ',' + encodeURIComponent(time);
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback('Canot find the forecast', error);
        } else {
            callback(undefined, response.body);
        }
    })
}

app.use('/getWeekly', (req, res, next) => {
    getWeekly(req.query.lat, req.query.lng, req.query.time, (error, forecastData) => {
        if(error) {
            return res.send({error});
        }
        res.send({
            forecast: forecastData,
            lat: req.query.lat, 
            lng: req.query.lng
        })
    });

});


const autoComplete = (userInput, callback) => {
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodeURIComponent(userInput) + "&types=(cities)&language=en&key=AIzaSyCwZnCsIBzYOgCMp2lVJwurkrM-7BiNHI8";
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback("Unable to connect to auto Complete", undefined);
        } else {
            callback(undefined, {
                data: response.body
            })
        }
    })
}


const curLoc = (callback) => {
    const url = "http://ip-api.com/json";
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback("Unable to connect to location service.", undefined);
        } else {
            callback(undefined, {
                lat: response.body.lat,
                lng: response.body.lon,
                city: response.body.city,
                state: response.body.region
            });
        }
    });
}

app.use('/curLocWeather', (req, res, next) => {
    curLoc((error, {lat, lng, city, state}) => {
        if (error) {
            return res.send({error});
        }
        forecast(lat, lng, city, (error, forecastData) => {
            res.send({
                forecast: forecastData,
                address: req.query.address,
                lat: lat, 
                lng:lng,
                city: city, 
                state: state
            })
        })
    })

});


app.use('/addressWeather', (req, res, next) => {
    geocode(req.query.street, req.query.city, req.query.state, (error, {lat, lng}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(lat, lng, req.query.city, req.query.state, (error, forecastData) => {
            res.send({
                forecast: forecastData,
                address: req.query.address,
                lat: lat, 
                lng: lng,
                city: req.query.city,
                state: req.query.state
            })
        })
    })
});

app.use('/autoComplete', (req, res, next) => {
    autoComplete(req.query.userInput, (error,data) => {
        if (error) {
            return res.send({ error });
        }
        res.send(data.data.predictions);
    })
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;