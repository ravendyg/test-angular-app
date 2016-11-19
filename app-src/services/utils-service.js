'use strict';

export function UtilsService()
{
  var self =
  {
    getUnixTimestamp,
    deepCopy,
    mergeSort
  };

  return self;

  function getUnixTimestamp()
  {
    return Math.round( Date.now() / 1000 );
  }

  function deepCopy(source)
  {
    return angular.copy(source);
  }

  function mergeSort(arr, comparator)
  {
    if (arr.length <= 1)
    {
      return arr;
    }
    else
    {
      var middle = Math.floor( arr.length / 2 );
      var arr1 = mergeSort( arr.slice(0, middle), comparator );
      var arr2 = mergeSort( arr.slice(middle), comparator );
      var temp = [];
      var pointer1 = 0, pointer2 = 0;

      while ( pointer1 < arr1.length && pointer2 < arr2.length )
      {
        if ( comparator(arr1[pointer1], arr2[pointer2]) === 1 )
        {
          temp.push( arr2[pointer2++] );
        }
        else
        {
          temp.push( arr1[pointer1++] );
        }
      }
      while ( pointer1 < arr1.length )
      {
        temp.push( arr1[pointer1++] );
      }
      while ( pointer2 < arr2.length )
      {
        temp.push( arr2[pointer2++] );
      }

      return temp;
    }
  }
}