
currencyMaskedInput();

//функция, форматирующая ввод данных пользователя к денежному формату 00,000,000
function currencyMaskedInput() {

  //получение списка полей input с атрибутом currency
  let inputFields = document.querySelectorAll("input[currency]");

  //замена введённого в поле текста на значение необходимого формата
  inputFields.forEach((elem) => elem.addEventListener('input', function () {
    const inputValue = elem['value'];
    elem['value'] = inputValue ? currencyMask(inputValue) : null;
  }));
}



// заменяет строку типа 10000 на 10,000
/*
1. Находим подстроку до точки (разделителя дробной части), если она есть и преобразовываем эту подстроку в массив (arrayFromString);
2. Если разделитель есть, находим подстроку, начиная с него (включительно) и до конца строки (strRest), затем возвращаем
   строку, состоящую из преобразованного к строке arrayFromString + strRest;
3. Иначе возвращаем только преобразованный к строке arrayFromString.
 */
function currencyMask(str) {
  const myReg = /(\d+((,\d+)+)?\.?)/g;
  //проверка на число вводимых пользователем данных
  if (str.search(myReg) === -1) {
    return '';
  }
  const regRest = /\.(\d+)?/g;

  const arrayFromString = getSubStr(str, myReg).split('');
  const mArray = maskedArray(arrayFromString);

  if (arrayFromString[arrayFromString.length - 1] === '.') {
    const strRest = getSubStr(str, regRest);
    return mArray.join('') + strRest;
  }

  return mArray.join('');
}



//получение подстроки, соответствующей регэкспу
function getSubStr(str, regularExp) {
  return str.match(regularExp)[0];
}



//формат массива, состоящего из символов строки
function maskedArray(arr) {
  //получаем очищенный от "," и "." массив, если они присутствуют
  let clearArray = cleaningArray(arr);
  //вставляем разделитель "," через каждые 3 элемента массива (справа налево)
  let capacity = clearArray.length - 3;
  while (capacity > 0) {
    clearArray.splice(capacity, 0, ',');
    capacity -= 3;
  }
  return clearArray;
}



//фильтрация массива ( получаем массив без "," и без ".")
function cleaningArray(arr) {
  return  arr.filter( (elem) => elem !== ',' && elem !== '.');
}