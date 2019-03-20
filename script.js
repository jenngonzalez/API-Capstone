'use strict';

const apiKey = 'AIzaSyB82XBq6funiFeBBP91XYK-Hk9LdpOiqPY';

const searchURL = 'https://www.googleapis.com/youtube/v3/search/'


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" width="320" height="240" controls allowFullScreen>
      </iframe>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getVideos(searchTerm) {
  const params = {
    part: 'snippet',
    key: apiKey,
    order: 'viewCount',
    type: 'video',
    videoEmbeddable: true,
    q: searchTerm
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-user-search').val();
    getVideos(searchTerm);
  });
}

$(watchForm);