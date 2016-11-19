'use strict';

export function AmountToWord()
{
  return input =>
  {
    var out;

    if (typeof input !== 'number')
    {
      out = 'wrong amount';
    }
    else if (input > 10)
    {
      out = 'many';
    }
    else if (input > 5)
    {
      out = 'several';
    }
    else if (input > 0)
    {
      out = 'few';
    }
    else
    {
      out = 'out of stock';
    }

    return out;
  };
}