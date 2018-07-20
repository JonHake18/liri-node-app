require("dotenv").config();
var fs = require("fs");
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var app = {
    "my-tweets": function () {
        var params = {screen_name: 'TedTalks'};
        client.get('statuses/user_timeline', params, function (error, tweetData, response) {
            if (!error) {
                for(var i = 0; i<tweetData.length; i++){
                    var date = tweetData[i].created_at;
                    console.log("@TedTalks: " + tweetData[i].text + " Created At: " + date.substring(0, 19));
                    console.log("-----------------------");

                app.logData(tweetData);
            } 
        }
            else {
                console.log(error);
            }
        });
    },
    
    "spotify-this-song": function (keyword) {
        spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }

            else if (data.tracks.items.length > 0) {
                var record = data.tracks.items[0];

                console.log(' ');
                console.log('================ Song Info ================');
                console.log('Artist: ' + record.artists[0].name);
                console.log('Name: ' + record.name);
                console.log('Link: ' + record.preview_url);
                console.log('Album: ' + record.album.name);
                console.log('===========================================');
                console.log(' ');

                app.logData(data);
            } else {
                console.log('No song data found.');
            }



        });
    },
    "movie-this": function (query) {
        request('http://www.omdbapi.com/?t=' + (query || 'Mr.Nobody') + '&tomatoes=true&apikey=trilogy', function (error, response, info) {
            if (!error && response.statusCode == 200) {

                var movieData = JSON.parse(info);

                console.log(' ');
                console.log('================ Movie Info ================');
                console.log('Title: ' + movieData.Title);
                console.log('Year: ' + movieData.Year);
                console.log('IMDB Rating: ' + movieData.imdbRating);
                console.log('Country: ' + movieData.Country);
                console.log('Language: ' + movieData.Language);
                console.log('Plot: ' + movieData.Plot);
                console.log('Actors: ' + movieData.Actors);
                console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
                console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
                console.log('===========================================');
                console.log(' ');

                app.logData(movieData);
            }
        });
    },
    "do-what-it-says": function () {
        fs.readFile('random.txt', 'utf8', function (err, data) {
            if (err) throw err;
            console.log(data.toString());

            var cmds = data.toString().split(',');

            app[cmds[0].trim()](cmds[1].trim());
        });
    },
    logData: function (data) {
        fs.appendFile('log.txt', JSON.stringify(data, null, 2) + '\n====================================================================================', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
};


app[process.argv[2]](process.argv[3]);