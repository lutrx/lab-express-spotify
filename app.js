require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
})


app.get('/artist-search', async (req, res) => {
    //console.log(req.query);
    try {
        const search = await spotifyApi.searchArtists(req.query.artist)
        const artistItems = search.body.artists.items;
        console.log('The received data from the API: ', artistItems)
        let artistArray = [];
        artistItems.forEach(artist => {
            if (artist.images.length > 0) {
                artistArray.push({
                    name: `${artist.name}`,
                    image: `${artist.images[0].url}`,
                })
            } else {
                artistArray.push({
                    name: `${artist.name}`,
                })
            }
        });
        res.render('artist-search-results', {artistArray});
    } catch (error) {
        console.log('The error while searching artists occurred: ', error);
    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
