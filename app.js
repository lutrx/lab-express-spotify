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
                    id: `${artist.id}`
                })
            } else {
                artistArray.push({
                    name: `${artist.name}`,
                    id: `${artist.id}`
                })
            }
        });
        res.render('artist-search-results', {artistArray});
    } catch (error) {
        console.log('The error while searching artists occurred: ', error);
    }
})

app.get('/albums/:artistId', async (req, res, next) => {
    try {
        //console.log(req.query);
        const {artistId} = req.params
        const albumSearch = await spotifyApi.getArtistAlbums(artistId)
        const resultSearchAlbums = albumSearch.body.items
        console.log('What is my result: ', resultSearchAlbums);
        let albumArray = [];
        resultSearchAlbums.forEach(album => {
            if (album.images.length > 0) {
                albumArray.push({
                    name: `${album.name}`,
                    image: `${album.images[0].url}`,
                    id: `${album.id}`
                })
            } else {
                albumArray.push({
                    name: `${album.name}`,
                    id: `${album.id}`
                })
            }
        });
        res.render('albums', {albumArray});
    } catch (error) {
        console.log('There is some error: ', error);
    }
})

app.get('/tracks/:albumId', async (req, res, next) => {
    try {
        const {albumId} = req.params;
        const trackSearch = await spotifyApi.getAlbumTracks(albumId)
        const resultSearchTracks = trackSearch.body.items
        console.log('What is my track result: ', resultSearchTracks);
        let tracksArray = [];
        resultSearchTracks.forEach(track => {
                tracksArray.push({
                    name: `${track.name}`,
                    preview: `${track.preview_url}`,
                    id: `${track.id}`
                })
        });
        res.render('tracks', {tracksArray});
    } catch (error) {
        console.log('There is some error: ', error);
    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
