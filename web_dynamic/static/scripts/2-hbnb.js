/**
 * This function enables the display of checked checkboxes
 * in the filter `Amenities`, and checks the status of an api
 */
function runIndexPage () {
  const selectedIds = {};

  $('li input:checkbox').on('change', function () {
    if ($(this).is(':checked')) {
      console.log($(this).data('id'));
      selectedIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if ($(this).not(':checked')) {
      delete selectedIds[$(this).attr('data-id')];
    }
    if (Object.values(selectedIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(selectedIds).join(', '));
    }
  });
  // check the status of the api
  $.get({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });
}

$(document).ready(runIndexPage());
