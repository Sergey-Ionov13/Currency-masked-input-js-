
currencyMaskedInput();

/*
Выбираем все поля "input" с атрибутом "currency". Затем на событие "input" в этих полях вешаем обработчик, который считывает
введённые данные.Если данные введены, то они в качестве параметра передаются в функцию "currencyMask" для дальнейшей обработки.
*/
function currencyMaskedInput() {

  let inputFields = document.querySelectorAll("input[currency]");

  inputFields.forEach((elem) => elem.addEventListener('input', () => {
    const inputValue = elem['value'];
    if (inputValue) elem['value'] = currencyMask(inputValue);
  }));
}

/*
Проверяем полученную строку с помощью функции "correctingString", которая позволяет вводить цифры, запятую и точку, а в случае
необходимости удаляет из этой строки недопустимые символы (если строка была введена не последовательно а с помощью "copy/paste").
Результат работы "correctingString" присваевается переменной "processingStr".

Далее разбиваем строку "processingStr" на массив ("arrFromStr") и в случае наличия в нём точки (.), проверяем наличие запятых,
т.е. длину массива "commasIndexes". Если они есть, проверяем их расположение и если они расположены неправильно, исправляем это
с помощью функции "maskStr", предварительно очистив массив от запятых функцией "cleaningArr".

Если же точки нет, то проверяем, есть ли в конце "arrFromStr" последовательность из более чем 3-х цифр. Если такая последовательность
есть, или запятых в массиве нет вообще, то вставляем в массив недостающие запятые.

А если запятых в массиве больше одной, проверяем их расположение и если они расположены неправильно, исправляем это.

Функция "currencyMask" возвращает строку, преобразованную к необходимому формату.
 */
function currencyMask(str) {

  const processingStr = correctingString(str);
  let arrFromStr = processingStr.split('');
  let commasIndexes = getCommasIndexes(arrFromStr);
  const dotIndex = getDotIndex(arrFromStr);

  if (~dotIndex) {
    if (commasIndexes.length) {
      if (!checkCommasIndexValid(dotIndex, commasIndexes)) {
        return maskStr(cleaningArr(arrFromStr));
      }
    }
  } else if (arrFromStr.lastIndexOf(',') < arrFromStr.length - 4) {
    return maskStr(cleaningArr(arrFromStr));
  } else if (commasIndexes.length > 1) {
    if (!checkCommasIndexValid(commasIndexes[commasIndexes.length - 1] + 4, commasIndexes)) {
      return maskStr(cleaningArr(arrFromStr));
    }
  }
  return processingStr;
}

/*
проверяем переданную в качестве параметра строку на соответствие необходимому формату. Если соответствие есть, то её же и возвращаем,
если нет, то функция ищет подстроку, соответствующую "backupReg до первой ошибки и возвращает её, а если строка состоит из
недопустимых символов, то возвращается пустая строка.
 */
function correctingString(str) {

  const myReg = /^(\d+)((,?\d*)*\.?\d*)$/;
  const backupReg = /(\d+)(,?\d*)*\.?\d*/;

  if (!~str.search(myReg)) {
    if (~str.search(backupReg)) {
      return str.match(backupReg)[0];
    } else {
      return '';
    }
  }
  return str;
}

function getCommasIndexes(arr) {

  let commasIndexesArr = [];
  const lastIndex = ~getDotIndex(arr) ? getDotIndex(arr) : arr.length;

  for (let i = 0; i < lastIndex;  i++) {
    if (arr[i] === ',') commasIndexesArr.push(i);
  }

  return commasIndexesArr;
}

function getDotIndex(arr) {
  return arr.indexOf('.');
}

function cleaningArr(arr) {
  return ~arr.indexOf(',') ? arr.filter( (elem) => elem !== ',') : arr;
}

/*
Функция принимает массив без "," в качестве параметра и вставляет "," в необходимые места, затем возвращает стрроку,
приведённую к необходимому формату.
 */
function maskStr(cleanArr) {
  let maskArr = cleanArr.slice();
  let capacity = ~cleanArr.indexOf('.') ? cleanArr.indexOf('.') - 3 : cleanArr.length - 3;
  while (capacity > 0) {
    maskArr.splice(capacity, 0, ',');
    capacity -= 3;
  }
  return maskArr.join('');
}

/*
Проверяем, правильно ли расположены "," в принимаемом массиве.
 */
function checkCommasIndexValid(dotIndex, arr) {
  const sumIndexes = arr.reduce( (sum, current) => sum + current );
  const averageIndex = sumIndexes / arr.length;
  return averageIndex + (arr.length + 1) * 2 === dotIndex;
}
