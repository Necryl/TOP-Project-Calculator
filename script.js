// defining elements
const display = document.querySelector('.screen');
let temp_buttons = document.querySelector('.buttons');
const buttonsArray = run(() => {
    let result = [];
    let temp_btnCol;
    let temp_btnColumns = document.querySelectorAll('.btnCol');
    let temp_btnColum;
    for (let i = 0; i < temp_btnColumns.length; i++) {
        temp_btnCol = [];
        temp_btnColum = document.querySelectorAll(`.buttons .btnCol:nth-child(${i+1}) .btn`);
        for (let x = 0; x < temp_btnColum.length; x++) {
            temp_btnCol.push(temp_btnColum[x]);
        }
        result.push(temp_btnCol);
    }
    return result;
})
const clearBtn = buttonsArray[4][0];
const undoBtn = buttonsArray[4][1];
const equalsBtn = buttonsArray[4][2];


// defining status variables
let inputArray = [];
let newNumber = true;


// define events



// defining some functions
function run(runThis) {
    return runThis();
}

const calculate = {
    add: (num1, num2) => num1 + num2,
    subtract: (num1, num2) => num1 - num2,
    multiply: (num1, num2) => num1 * num2,
    divide: (num1, num2) => num1 / num2,
};

const operate = {
    input: (data, type) => {
        if (type === 'num') {
            if (display.textContent === '0') {
                if (data !== '0') {
                    inputArray.push([data, type]);
                }
                newNumber = false;
                display.textContent = data;
            } else {
                if (newNumber) {
                    inputArray.push([data, type]);
                    display.textContent += ' ' + data;
                    newNumber = false;
                } else {
                    inputArray[inputArray.length - 1][0] += data;
                    display.textContent += data;
                }
            }
        } else if (type === 'period') {
            let permit = false;
            if (display.textContent === '0') {
                inputArray.push(['0.', 'num']);
                newNumber = false;
                permit = true;
            } else if (inputArray[inputArray.length - 1][0][inputArray[inputArray.length - 1][0].length -1] !== '.') {
                inputArray[inputArray.length - 1][0] += '.';
                permit = true;
            }
            if (permit) {
                display.textContent += '.';
            }
        } else if (type === 'operator') {
            inputArray.push([data, type]);
            newNumber = true;
            if (data === '/') {
                display.textContent += ` \u00f7`;
            } else {
                display.textContent += ` ${data}`;
            }
        }
        // console.log(inputArray);
    },
    clear: () => {
        display.textContent = '0';
        inputArray = [];
    },
    calculate: () => {
        let inLen = inputArray.length;
        let permit = false;
        let num1;
        let num2;
        let operator;
        if (inLen > 2) {
            num1 = inputArray[inLen - 3];
            num2 = inputArray[inLen - 1];
            operator = inputArray[inLen - 2];
            if (num1[1] === 'num' || num1[1] === 'result') {
                if (num2[1] === 'num' && operator[1] === 'operator') {
                    permit = true;
                    num1 = num1[0];
                    num2 = num2[0];
                    operator = operator[0];
                }
            }
        }
        if (permit) {
            let result;
            num1 = Number(num1);
            num2 = Number(num2);
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case 'x':
                    result = num1 * num2;
                    break;
                case '/':
                    result = num1 / num2;
                    break;
                case '%':
                    result = num1 % num2;
                    break;
            }
            inputArray.push([`${result}`, 'result']);
            display.textContent = result;
        }
    },
}