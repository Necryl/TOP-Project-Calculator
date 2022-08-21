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
const buttonsObject = {
    '0': buttonsArray[1][3],
    '1': buttonsArray[0][0],
    '2': buttonsArray[1][0],
    '3': buttonsArray[2][0],
    '4': buttonsArray[0][1],
    '5': buttonsArray[1][1],
    '6': buttonsArray[2][1],
    '7': buttonsArray[0][2],
    '8': buttonsArray[1][2],
    '9': buttonsArray[2][2],
    '.': buttonsArray[0][3],
    '+': buttonsArray[3][0],
    '-': buttonsArray[3][1],
    '*': buttonsArray[3][2],
    '/': buttonsArray[3][3],
    '%': buttonsArray[2][3],
    'Escape': buttonsArray[4][0],
    'z': buttonsArray[4][1],
    'Backspace': buttonsArray[4][2],
    'Enter': buttonsArray[4][3],
    '=': buttonsArray[4][3],
}
const clearBtn = buttonsArray[4][0];
const undoBtn = buttonsArray[4][1];
const equalsBtn = buttonsArray[4][2];


// defining status variables
let inputArray = [];
let newNumber = true;
let history = [['0', []]];


// define events
window.addEventListener('keydown', event => {
    valid = false;
    if ('0123456789-+/*%.='.includes(event.key) || ['Backspace', 'Enter', 'Escape'].includes(event.key)) {
        valid = true;
    } else if (event.ctrlKey && event.key === 'z') {
        valid = true;
    }

    if (valid) {
        buttonsObject[event.key].click();

    }
});


// defining some functions
function run(runThis) {
    return runThis();
}

const operate = {
    input: (data, type) => {
        let lastData = [null, null]
        if (inputArray.length !== 0) {
            if (inputArray[inputArray.length - 1][1] === 'snark') {
                operate.clear()
            } else {
                lastData[0] = inputArray[inputArray.length - 1][0];
                lastData[1] = inputArray[inputArray.length - 1][1];
            }
        }
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
            if (display.textContent === '0' || lastData[1] !== 'num') {
                inputArray.push(['0.', 'num']);
                newNumber = false;
                permit = true;
            } else if (inputArray[inputArray.length - 1][0][inputArray[inputArray.length - 1][0].length -1] !== '.') {
                inputArray[inputArray.length - 1][0] += '.';
                permit = true;
            }
            if (permit) {
                if (lastData[1] === 'operator') {
                    display.textContent += ' 0.';
                } else {
                    display.textContent += '.';
                }
            }
        } else if (type === 'operator') {
            operate.calculate();
            if (lastData[0] !== data) {
                let text;
                if (data === '/') {
                    text = ` \u00f7`;
                } else {
                    text = ` ${data}`;
                }
                if (lastData[1] === 'operator') {
                    inputArray[inputArray.length - 1][0] = data;
                    display.textContent = display.textContent.slice(0, display.textContent.length - 2) + text;
                } else {
                    if (inputArray.length === 0) {
                        inputArray.push(['0', 'num']);
                    }
                    inputArray.push([data, type]);
                    display.textContent += text;
                    newNumber = true;
                }
            }
        }
    },
    clear: () => {
        if (inputArray.length !== 0 && display.textContent !== '0') {
            operate.historyEntry();
            display.textContent = '0';
            inputArray = [];
            operate.historyEntry();
        }
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
                    if (num2 === 0) {
                        result = ':|'
                    } else {
                        result = num1 / num2;
                    }
                    break;
                case '%':
                    result = num1 % num2;
                    break;
            }
            operate.historyEntry();
            if (result === ':|') {
                inputArray.push([`${result}`, 'snark']);
            } else {
                inputArray.push([`${result}`, 'result']);
            }
            display.textContent = result;
            operate.historyEntry();
        }
    },
    backspace: () => {
        if (inputArray.length !== 0) {
            let item = cloneArray(inputArray[inputArray.length - 1]);
            if (item[1] === 'operator' || item[0].length === 1) {
                inputArray.pop();
                if (display.textContent.length === 1) {
                    display.textContent = '0';
                } else {
                    display.textContent = display.textContent.slice(0, display.textContent.length - 2);
                }
                operate.historyEntry();
            } else {
                operate.historyEntry();
                inputArray[inputArray.length - 1][0] = item[0].slice(0, item[0].length - 1);
                display.textContent = display.textContent.slice(0, display.textContent.length - 1);
                operate.historyEntry();
            }
        }
    },
    undo: () => {
        if (history.length > 2) {
            history.pop();
            let rewind = cloneArray(history[history.length - 1]);
            
            display.textContent = rewind[0];
            inputArray = rewind[1];
        }
    },
    historyEntry: () => {
        let entry = [display.textContent, cloneArray(inputArray)];
        if (!compareArrays(history[history.length - 1], entry)) {
            history.push(entry);
        }
    }
}
function compareArrays(array1, array2) {
    let result = true;
    if (array1.length === array2.length) {
        for (let i = 0; i < array1.length; i++) {
            if (Array.isArray(array1[i]) !== Array.isArray(array2[i])) {
                result = false;
            } else if (Array.isArray(array1[i])) {
                if (!compareArrays(array1[i], array2[i])) {
                    result = false;
                }
            } else if (array1[i] !== array2[i]) {
                result = false;
            }
        }
    } else {
        result = false;
    }
    return result;
}

function cloneArray(array) {
    let result = array.slice(0);

    for (let i = 0; i < result.length; i++) {
        if (Array.isArray(result[i])) {
            result[i] = cloneArray(result[i]);
        }
    }

    return result;
}