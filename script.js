'use strict';

const youTubeApiKey = 'AIzaSyB82XBq6funiFeBBP91XYK-Hk9LdpOiqPY';

const youTubeSearchURL = 'https://www.googleapis.com/youtube/v3/search/'

const eventApiKey = 'pNPBSZnVpAU8ZxAVgUyl15pNzaRioPah';

const eventSearchURL = 'https://app.ticketmaster.com/discovery/v2/events.json'


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayYouTubeResults(responseJson) {
  console.log(responseJson);
  $('#youtube-results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#youtube-results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" width="320" height="240" controls allowFullScreen>
      </iframe>
      </li>`)};
  //display the results section  
  $('#youTubeResults').removeClass('hidden');
};

function displayEventResults(responseJson) {
    console.log(responseJson);
    $('#event-results-list').empty();
    for (let i=0; i < responseJson._embedded.events.length; i++){
      $('#event-results-list').append(`
        <li>${responseJson._embedded.events[i].dates.start.localDate}
        <h3><a href="${responseJson._embedded.events[i].url}">${responseJson._embedded.events[i]._embedded.venues[0].name}</a></h3>
        ${responseJson._embedded.events[i]._embedded.venues[0].city.name}, ${responseJson._embedded.events[i]._embedded.venues[0].state.name}
        </li>
        <br><br>
        `
      )};
    //display the results section  
    $('#eventResults').removeClass('hidden');
  };

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
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getEvents(searchTerm) {
    const params = {
        apikey: eventApiKey,
        keyword: searchTerm
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
          // $('#js-error-message').text(`Something went wrong: ${err.message}`);
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-user-search').val();
    getVideos(searchTerm);
    getEvents(searchTerm);
  });
}

$(watchForm);