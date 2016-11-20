'use strict';

export function ReviewsService($http)
{
  var selectedItem;

	var self =
  {
    reviews: [],
    refreshIndex: 0,

    fetchReviews,
    sendReview
  };

  return self;

  function fetchReviews(itemId)
  {
    selectedItem = itemId;
    self.reviews = [];

    $http({
      method: 'GET',
      url: '/reviews/' + itemId
    })
    .then(
      resp =>
      {
        if (selectedItem === itemId)
        { // check that user hasn't changed his mind
          self.reviews = resp.data.reviews;
          self.refreshIndex++;
        }
      }
    )
    .catch( () => {} );
  }

  function sendReview({text, rating}, itemId)
  {
    $http({
      method: 'POST',
      url: '/reviews',
      data: {text, rating, itemId}
    });

    if (selectedItem === itemId)
    {
      self.reviews.push({
        ext, rating
      });
      self.refreshIndex++;
    }
  }
}