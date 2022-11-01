#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const argv = minimist(process.argv.slice(2))

//const fetch = require('node-fetch');
//const moment = require('moment-timezone');
//var argv = require('minimist')(process.argv.slice(2));
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


// Make a request



const baseApiURL = new URL('https://api.open-meteo.com/v1/forecast?current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant');

 
if(argv.j){
    process.exit(0);
}

if(argv.n){
    baseApiURL.searchParams.append('latitude', argv.n.toFixed(2));
}
if(argv.s){
    baseApiURL.searchParams.append('latitude', -argv.s.toFixed(2));
}
if(argv.e){
    baseApiURL.searchParams.append('longitude', argv.e.toFixed(2));
}
if(argv.w){
    baseApiURL.searchParams.append('longitude', -argv.w.toFixed(2));
}
//if(argv.z){
//baseApiURL.searchgiParams.append('timezone',moment.tz.guess());
//}

if (argv.z) {
	let timezone = moment.tz.guess();
    baseApiURL.searchParams.append('timezone', timezone);
}

let day = argv.d;
if(typeof argv.d !== 'undefined'){
    if(argv.d == 0){
        console.log("today.")
        }else if (argv.d > 1 ){
            console.log("in " + argv.d + " days.")
        } else {
          console.log("tomorrow.")
        }
}else{
    day = 1
}
fetch(decodeURIComponent(baseApiURL.href)).then(function(response){
    response.json().then(function(data){
        if(argv.j){
            console.log(data);
        }
         if(data.daily.precipitation_hours[day] >0){
            process.stdout.write("You might need your galoshes");
         }else{
             process.stdout.write("You will not need your galoshes");
         }
    //console.log(data);
    });
});

