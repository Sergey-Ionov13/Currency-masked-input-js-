
currencyMaskedInput();

//функция, форматирующая ввод данных пользователя к денежному формату 00,000,000
function currencyMaskedInput() {

    //получение массива полей input с атрибутом currency
    let inputFields = document.querySelectorAll("input[currency]");
    let arrInputs = [];
    for (let i = 0; i < inputFields.length; i++) {
        arrInputs.push(inputFields[i]);
    }

    //замена введённого в поле текста на значение необходимого формата
    for (let i = 0; i < arrInputs.length; i++) {
        arrInputs[i].addEventListener("keyup", function () {
            const inputValue = arrInputs[i]['value'];
            if (inputValue) {
                arrInputs[i]['value'] = currencyMask(inputValue);
            }
        });
    }
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

    //получаем очищенный от "," массив, если они присутствуют
    let arrWithoutComma = deleteAllCommasFromArray(arr);

    //присваиваем переменной mArray массив без разделителя дробной части
    let mArray = (arrWithoutComma[arrWithoutComma.length - 1] === '.') ? arrWithoutComma.slice(0, arrWithoutComma.length - 1) : arrWithoutComma.slice();
    //вставляем разделитель "," через каждые 3 элемента массива (справа налево)
    let capacity = mArray.length - 3;
    while (capacity > 0) {
        mArray.splice(capacity, 0, ',');
        capacity -= 3;
    }

    //фильтрация массива ( получаем массив без ",")
    function deleteAllCommasFromArray(arr) {
        return  arr.filter(function (elem) {
            return elem !== ',';
        });
    }

    return mArray;
}