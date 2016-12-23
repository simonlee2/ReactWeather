const express = require('express');
const parseString = require('xml2js').parseString;
const rp = require('request-promise');
const app = express();
// app.use(cors);
app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

function requestWeatherInfo(dataid) {
    var options = { 
        method: 'GET',
        url: 'http://opendata.cwb.gov.tw/opendataapi',
        qs: { 
            dataid: dataid,
            authorizationkey: 'CWB-CD4F5BAD-7054-48A1-BF5E-5B0B94F87385' 
        },
        headers: {
            'cache-control': 'no-cache',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.'
        }
    };
    return rp(options)
            .then(parseXML);
}

function request36Forecast() {
    return requestWeatherInfo('F-C0032-002');
}

function requestOneWeekForecast() {
    return requestWeatherInfo('F-C0032-004');
}

function parseXML(string) {
    var promise = new Promise( (resolve, reject) => {
        parseString(string, (err, result) => {
            if (string.indexOf("cwbopendata") !== -1) {
                resolve(result);
            } else {
                reject("Failed xml request lolz");
            }
        })
    })

    return promise;
}

function locationsFromForecast(json) {
    return json['cwbopendata']['dataset'][0]['location'];
}

function namesFromLocations(locations) {
    return locations.map( (location) => {
        return location['locationName'][0];
    })
}

function namesFromForecast(json) {
    return namesFromLocations(locationsFromForecast(json));
}

function convertLocationParamToName(locationParam) {
    return locationParam.replace(/-/g, ' ').toUpperCase();
}

function filterForLocation(locations, locationParam) {
    const locationName = convertLocationParamToName(locationParam);
    for ( const location of locations) {
        if (location['locationName'][0] === locationName) {
            return location['weatherElement'];
        }
    }
    return undefined;
}

function filterForElement(elements, elementName) {
    for ( const element of elements) {
        if (element['elementName'][0] === elementName) {
            return element['time'];
        }
    }
    return undefined;
}

/**
    Locations:

    taipei-city
    new-taipei-city
    taoyuan-city
    taichung-city
    tainan-city
    kaohsiung-city
    keelung-city
    hsinchu-county
    hsinchu-city
    miaoli-county
    changhua-county
    nantou-county
    yunlin-county
    chiayi-county
    chiayi-city
    pingtung-county
    yilan-county
    hualien-county
    taitung-county
    penghu-county
    kinmen-county
    lienchiang-county
*/
app.get('/api/locations', (req, res) => {
    request36Forecast()
        .then(namesFromForecast)
        .then( (names) => {
            res.send(JSON.parse(JSON.stringify(names)));
        })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

/**
    :location - See above /api/locations
*/
app.get('/api/:location/thirtysix', (req, res) => {
    request36Forecast()
        .then(locationsFromForecast)
        .then( (locations) => {
            return filterForLocation(locations, req.params.location);
        })
        .then( (json) => {
            res.send(JSON.parse(JSON.stringify(json)));
        })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

/**
    :location - See above /api/locations
    :elementName - Wx, MaxT, MinT, CI, PoP
*/
app.get('/api/:location/thirtysix/:elementName', (req, res) => {
    request36Forecast()
        .then(locationsFromForecast)
        .then( (locations) => {
            return filterForLocation(locations, req.params.location);
        })
        .then( (elements) => {
            const element = filterForElement(elements, req.params.elementName);
            res.send(JSON.parse(JSON.stringify(element)));
        })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

/**
    :location - See above /api/locations
    :elementName - Wx, MaxT, MinT
*/
app.get('/api/:location/week/:elementName', (req, res) => {
    requestOneWeekForecast()
        .then(locationsFromForecast)
        .then( (locations) => {
            return filterForLocation(locations, req.params.location);
        })
        .then( (elements) => {
            const element = filterForElement(elements, req.params.elementName);
            res.send(JSON.parse(element));
        })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});