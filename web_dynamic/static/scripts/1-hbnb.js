/**
 * This function enables the display of checked checkboxes
 * in the filter `Amenities`.
 */
function displayCheckedItems () {
  const selectedIds = [];

  $('li input:checkbox').on('change', function () {
    if ($(this).is(':checked')) {
      console.log($(this).data('id'));

      $('div.amenities h4').append('<span>' + $(this).data('name') + '</span>');
      selectedIds.push($(this).data('id'));
      console.log(selectedIds);
    } else if ($(this).not(':checked')) {
      if (selectedIds.includes($(this).data('id'))) {
        const idx = selectedIds.indexOf($(this).data('id'));
        selectedIds.splice(idx, 1);
      }
      $('div.amenities span:last-child').remove();
    }
    const firstChild = $('div.amenities h4').children(':first-child');
    let firstChildText = firstChild.text();

    const maxLength = 20;

    if (firstChildText.length > maxLength) {
      firstChildText = firstChildText.slice(0, maxLength) + '...';
    }
    firstChild.text(firstChildText);

    $('div.amenities h4').children().not(':first-child').hide();
    // $('div.amenities h4').children().css('display', 'block');
  });
}

$(document).ready(displayCheckedItems());

// (function () {
//     const selectedArray = $('input:checkbox').map(function () {
//         return $(this).data('name');
//     }).get();
//     console.log(selectedArray);
// })();
