#!/usr/bin/env node
const fetch = require('node-fetch');
const moment = require('moment-timezone');
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
if(argv.h === true){
    console.log(`
    Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
    `)
    process.exit(0);
}
let latitude, longitude, timezone, day, prettyify
// Make a request



const baseApiURL = await URL('https://api.open-meteo.com/v1/forecast?current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant');
const data = await baseApiURL.json();
 
if(argv.j){
    console.log(data);
    process.exit(0);
}

if(argv.n){
    if(argv.s){
        baseApiURL.searchParams.append('latitude', -argv.n);
    }else{
        baseApiURL.searchParams.append('latitude', argv.n);

    }

}
if(argv.e){
    if(argv.w){
        baseApiURL.searchParams.append('latitude', -argv.e)
    }else{
        baseApiURL.searchParams.append('latitude', -argv.e)
    }
baseApiURL.searchParams.append('longitude', argv.e);
}
if(argv.z){
baseApiURL.searchParams.append('timezone',moment.tz.guess());
}
if(argv.d == 0){
console.log("today.")
}else if (argv.d > 1 ){
    console.log("in " + argv.d + " days.")
} else {
  console.log("tomorrow.")
}
console.log(decodeURIComponent(baseApiURL.href));
fetch(decodeURIComponent(baseApiURL.href)).then(function(response){
response.json().then(function(data){
console.log(data);
});
});

if(argv.j){
    console.log(data);
    process.exit(0);
}