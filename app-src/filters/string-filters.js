'use strict';

export function UnixDateToDotString()
{
  return input =>
  {
    var date, out;
    try
    {
      date = new Date(input * 1000);
      out =
      [
        indentZero(date.getDate()),
        indentZero(date.getMonth() + 1),
        date.getFullYear()
      ]
      .join('.')
      ;
    }
    catch (err)
    {
      out = 'wrong date';
    }

    return out;
  }
}

export function CapFirstLetters()
{
  return input =>
    input
      ? input.split(' ').map( e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() ).join(' ')
      : ''
      ;
}

function indentZero(val)
{
  return (val < 10 ? '0' : '') + val;
}