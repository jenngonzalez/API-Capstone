'use strict';

const youTubeApiKey = 'AIzaSyB82XBq6funiFeBBP91XYK-Hk9LdpOiqPY';

const youTubeSearchURL = 'https://www.googleapis.com/youtube/v3/search/'

const eventApiKey = 'pNPBSZnVpAU8ZxAVgUyl15pNzaRioPah';

const eventSearchURL = 'https://app.ticketmaster.com/discovery/v2/events.json'

const wikiSearchURL = 'https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts%7Cpageimages&indexpageids=1&redirects=1&exchars=1200&exsectionformat=plain&piprop=name%7Cthumbnail%7Coriginal&pithumbsize=250&titles='


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayWikiResults(responseJson) {
    $('#wikiResults').empty();
    let pageID = responseJson.query.pageids[0];
    let pageTitle = responseJson.query.pages[pageID].title;
    // let pageThumbCheck = responseJson.query.pages[pageID].thumbnail.source;
    let pageThumb = '';
    let pageExtract = responseJson.query.pages[pageID].extract;
    //looks for if a thumbnail exists, and if so, let pageThumb variable be equal to the URL at .source
    if (responseJson.query.pages[pageID].thumbnail != null) {
        pageThumb = responseJson.query.pages[pageID].thumbnail.source;
    };
    $('#wikiResults').append(
        `
        <h2>WIKIPEDIA</h2>
        <img src="${pageThumb}" alt="${pageTitle}">
        <p>${pageExtract}</p>
        <a href="https://en.wikipedia.org/wiki/${pageTitle}" target="blank">More on Wikipedia</a>
        <hr>
        `
      );
  
    $('#wikiResults').removeClass('hidden');
 }



function displayYouTubeResults(responseJson) {
  console.log(responseJson);
  $('#youtube-results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#youtube-results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
       <iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" width="250" height="188" controls allowFullScreen>
       </iframe>
       </li>`)}; 
  $('#youTubeResults').removeClass('hidden');
};


function displayEventResults(responseJson) {
    console.log(responseJson);
    $('#event-results-container').empty();
    for (let i=0; i < responseJson._embedded.events.length; i++){
      $('#event-results-container').append(`
        <div id="event-date">${responseJson._embedded.events[i].dates.start.localDate}
        </div>
        <div id="event-location">
        <p><a href="${responseJson._embedded.events[i].url}" target="blank">${responseJson._embedded.events[i]._embedded.venues[0].name}</a></p>
        <p>${responseJson._embedded.events[i]._embedded.venues[0].city.name}, ${responseJson._embedded.events[i]._embedded.venues[0].state.name}</p>
        <hr>
        </div>
        `
      )};
    $('#eventResults').removeClass('hidden');
  };


function getWiki(searchTerm) {
    let modSearchTerm = searchTerm.split(" ");
    for (let i=0; i < modSearchTerm.length; i++){
    let testwd = modSearchTerm[i];
    let firstLetter = testwd.substr(0,1);
    let rest = testwd.substr(1, testwd.length -1)
    modSearchTerm[i] = firstLetter.toUpperCase() + rest
    }
    let newSearchTerm = modSearchTerm.join('%20');
  
    const url = wikiSearchURL + newSearchTerm
   
    console.log(url);
  
    fetch(url)
  
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayWikiResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Sorry, something went wrong!`);
      });
  }

function getVideos(searchTerm) {
  const params = {
    part: 'snippet',
    key: youTubeApiKey,
    order: 'viewCount',
    type: 'video',
    videoEmbeddable: true,
    q: searchTerm
  };
  const queryString = formatQueryParams(params)
  const url = youTubeSearchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYouTubeResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Sorry, something went wrong!`);
    });
}

function getEvents(searchTerm) {
    const params = {
        apikey: eventApiKey,
        keyword: searchTerm,
        sort: 'date,asc'
      };
      const queryString = formatQueryParams(params)
      const url = eventSearchURL + '?' + queryString;
    
      console.log(url);
    
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => displayEventResults(responseJson))
        .catch(err => {
          $('#event-no-results').text(`Sorry, unable to find any upcoming events for that artist.`);
        });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-user-search').val();
    $('#js-error-message').empty();
    $('#event-no-results').empty();
    $('#placeholder-image').hide();
    $('#results-container').removeClass('hidden');
    getVideos(searchTerm);
    getEvents(searchTerm);
    getWiki(searchTerm);
  });
}

$(watchForm);