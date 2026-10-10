const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

function convert_hundreds(num) {
  let word = '';
  if (num > 99) {
    word += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }
  if (num > 9 && num < 20) {
    word += teens[num - 10] + ' ';
  } else {
    if (num > 19) {
      word += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      word += ones[num] + ' ';
    }
  }
  return word.trim();
}

export function numberToWords(num) {
  if (num === 0) return 'zero';
  
  let word = '';
  
  if (num >= 1000000) {
    word += convert_hundreds(Math.floor(num / 1000000)) + ' million, ';
    num %= 1000000;
  }
  
  if (num >= 1000) {
    word += convert_hundreds(Math.floor(num / 1000)) + ' thousand, ';
    num %= 1000;
  }
  
  if (num > 0) {
    word += convert_hundreds(num);
  }
  
  return word.replace(/,\s*$/, '').trim();
}
