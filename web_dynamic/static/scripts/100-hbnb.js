const urlSearch = 'http://127.0.0.1:5001/api/v1/places_search/';
/**
 * This function enables the display of checked checkboxes
 * in the filter `Amenities`, and checks the status of an api.
 */
function runIndexPage () {
  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};
  const $divAmenities = $('div.amenities').find('li input:checkbox');
  const $allCities = $('.city-list').find('li input:checkbox');
  const $allStates = $('div.locations').find('h2 input:checkbox');

  // let idx = 0;
  // $allCities.each(function () {
  //   console.log($(this).data('name'), idx);
  //   idx++;
  // });

  // amenities checkbox
  $divAmenities.on('change', function () {
    if ($(this).is(':checked')) {
      // console.log($(this).data('id'), 'amenity');
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if ($(this).not(':checked')) {
      delete amenityIds[$(this).attr('data-id')];
    }
    if (Object.values(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  // states checkbox
  $allStates.on('change', function () {
    if ($(this).is(':checked')) {
      // console.log($(this).data('id'), 'state');
      stateIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if ($(this).not(':checked')) {
      $(this).data('name').fadeOut();
      delete stateIds[$(this).attr('data-id')];
    }
    if (Object.values(stateIds).length === 0) {
      $('div.locations h4').html('&nbsp;');
    } else {
      $('div.locations h4').text(Object.values(stateIds).join(', '));
    }
  });

  // cities checkbox
  $allCities.on('change', function () {
    if ($(this).is(':checked')) {
      // console.log($(this).data('id'), 'city');
      cityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if ($(this).not(':checked')) {
      delete cityIds[$(this).attr('data-id')];
    }
    if (Object.values(cityIds).length === 0) {
      $('div.locations h4').html('&nbsp;');
    } else {
      $('div.locations h4').text(Object.values(cityIds).join(', '));
    }
  });
  // check the status of the api
  $.get({
    url: 'http://127.0.0.1:5001/api/v1/status/',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });
  getAllPlaces();

  // filter the results with the search button
  $(':button').on('click', function () {
    $('section.places').empty();
    getAllPlaces(amenityIds, stateIds, cityIds);
  });
}

/**
 * getAllPlaces - makes an AJAX POST request to an api to
 * get all places
 * @return: Nothing
 */
function getAllPlaces (amenityList, stateIds, cityIds) {
  const amenityData = amenityList === undefined ? [] : amenityList;
  const stateData = stateIds === undefined ? [] : stateIds;
  const cityData = cityIds === undefined ? [] : cityIds;

  const $section = $('section.places');
  $.post({
    url: urlSearch,
    headers: {
      'Content-Type': 'Application/json'
    },
    data: JSON.stringify({
      amenities: Object.keys(amenityData),
      states: Object.keys(stateData),
      cities: Object.keys(cityData)
    }),
    success: function (response) {
      // sort the response objects alphabetically
      response.sort((arg1, arg2) => {
        const name1 = arg1.name.toLowerCase();
        const name2 = arg2.name.toLowerCase();

        if (name1 < name2) {
          return -1;
        } else if (name1 > name2) {
          return 1;
        }
        return 0;
      });
      if (response.length > 0) {
        $.each(response, function (index, obj) {
          // Place name and price
          const $h2PlaceName = $('<h2>');
          const $priceByNight = $('<div>', { class: 'price_by_night' });
          const $divTitle = $('<div>', { class: 'title_box' });

          // Guests information
          const $divClassInfo = $('<div>', { class: 'information' });
          const $divMaxGuest = $('<div>', { class: 'max_guest' });
          const $divNumberRoom = $('<div>', { class: 'number_rooms' });
          const $divNumberBathRoom = $('<div>',
            { class: 'number_bathrooms' });

          // Place description
          const $divUser = $('<div>', { class: 'user' });
          const $divDescription = $('<div>', { class: 'description' });
          const $article = $('<article>');
          let maxGuest = 0;
          let numRooms = 0;
          let numBathRooms = 0;

          // price and Name of place
          $h2PlaceName.text(obj.name).appendTo($divTitle);
          $priceByNight.text('$' + obj.price_by_night)
            .appendTo($divTitle);
          $divTitle.appendTo($article);

          // Place Information - number of guests, restrooms
          maxGuest = obj.max_guest > 1
            ? `${obj.max_guest} Guests`
            : `${obj.max_guest} Guest`;

          numRooms = obj.number_rooms > 1
            ? `${obj.number_rooms} Bedrooms`
            : `${obj.number_rooms} Bedroom`;

          numBathRooms = obj.number_bathrooms > 1
            ? `${obj.number_bathrooms} Bathrooms`
            : `${obj.number_bathrooms} Bathroom`;

          $divMaxGuest.text(maxGuest)
            .appendTo($divClassInfo);

          $divNumberRoom.text(numRooms)
            .appendTo($divClassInfo);
          $divNumberBathRoom.text(numBathRooms)
            .appendTo($divClassInfo);

          $divClassInfo.appendTo($article);
          $divUser.html('<b>Owner: </b>')
            .appendTo($article);
          $divDescription.html(obj.description).appendTo($article);

          $section.append($article);
        });
      }
    },
    error: function () {
      alert('Error in the response');
    }
  });
}

// Only runs when the page is loaded
$(document).ready(runIndexPage());
