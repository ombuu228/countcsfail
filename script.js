function incrementValue(incr) {
    const currentValueElement = document.getElementById('currentValue');
    let currentValue = parseFloat(currentValueElement.textContent);
    currentValue += incr;
    
    if (currentValue < 0) {
        alert('Баланс не может быть меньше 0.');
        return;
    }

    currentValueElement.textContent = currentValue.toFixed(1);
    updateTotalValue();
    saveCurrentValue();
}

function decrementValue(decr) {
    const currentValueElement = document.getElementById('currentValue');
    let currentValue = parseFloat(currentValueElement.textContent);
    currentValue -= decr;

    if (currentValue < 0) {
        alert('Баланс не может быть меньше 0.');
        return;
    }

    currentValueElement.textContent = currentValue.toFixed(1);
    updateTotalValue();
    saveCurrentValue();
}

function saveCurrentValue() {
    const currentValue = parseFloat(document.getElementById('currentValue').textContent);
    localStorage.setItem('currentValue', currentValue);
}

function loadCurrentValue() {
    const savedValue = localStorage.getItem('currentValue');
    if (savedValue !== null) {
        document.getElementById('currentValue').textContent = parseFloat(savedValue).toFixed(1);
    }
}

function saveToCalendar() {
    const currentValue = parseFloat(document.getElementById('currentValue').textContent);
    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');

    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const currentDate = today.toLocaleDateString('en-US', dateOptions);
    const currentTime = today.toLocaleTimeString('en-US', timeOptions);

    const data = {
        date: currentDate,
        time: currentTime,
        value: currentValue
    };

    saveDataToLocalStorage(data);

    updateHistory();
    updateTotalValue();
}


function clearHistory() {
    const confirmed = confirm('Точно ли вы хотите полностью очистить историю?');

    if (!confirmed) {
        return;
    }

    localStorage.removeItem('history');

    updateHistory();
    updateTotalValue();
}



function saveDataToLocalStorage(data) {
    let historyData = JSON.parse(localStorage.getItem('history')) || [];
    historyData.push(data);
    localStorage.setItem('history', JSON.stringify(historyData));
}


function deleteEntry(index) {
    const confirmed = confirm('Точно ли вы хотите удалить этот элемент истории?');

    if (!confirmed) {
        return;
    }

    let historyData = JSON.parse(localStorage.getItem('history')) || [];
    historyData.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(historyData));

    updateHistory();
    updateTotalValue();
}



function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '';

    const historyData = JSON.parse(localStorage.getItem('history')) || [];

    for (let i = 0; i < historyData.length; i++) {
        const entry = historyData[i];

        const entryElement = document.createElement('div');
        entryElement.classList.add('history-entry');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteEntry(i);
        entryElement.appendChild(deleteButton);

        const entryInfo = document.createElement('p');
        entryInfo.textContent = `${entry.date} ${entry.time} - ${entry.value.toFixed(1)}`;
        entryElement.appendChild(entryInfo);

        historyElement.appendChild(entryElement);
    }


    historyElement.scrollTop = historyElement.scrollHeight;
}


function updateTotalValue() {
    const totalValueElement = document.getElementById('totalValue');
    const historyData = JSON.parse(localStorage.getItem('history')) || [];

    const totalValue = historyData.reduce((sum, entry) => sum + entry.value, 0);
    totalValueElement.textContent = totalValue.toFixed(1);
}


function updateDateTime() {
    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');

    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    currentDateElement.textContent = today.toLocaleDateString('en-US', dateOptions);
    currentTimeElement.textContent = today.toLocaleTimeString('en-US', timeOptions);

    setTimeout(updateDateTime, 1000);
}


document.addEventListener('DOMContentLoaded', function () {
    loadCurrentValue();
    updateDateTime();
    updateHistory();
    updateTotalValue();

    const lastSavedDate = localStorage.getItem('lastSavedDate');
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (lastSavedDate !== currentDate) {
        localStorage.setItem('lastSavedDate', currentDate);
    }
});
function performFunction() {
    const select = document.getElementById('functions');
    const selectedValue = select.value;

    switch (selectedValue) {
        case 'convertToUah':
            convertToUah();
            break;
        case 'calculateCommission':
            calculateCommission();
            break;
        default:
            break;
    }
}

function convertToUah() {
    const currentValue = parseFloat(document.getElementById('currentValue').textContent);
    const exchangeRate = 37.05;
    const result = currentValue * exchangeRate;
    displayResult(`Сумма в гривнах: ${result.toFixed(2)}`);
}

function calculateCommission() {
    const totalValue = parseFloat(document.getElementById('totalValue').textContent);
    const commissionRate = 0.10;
    const commissionFee = 1;
    const commission = totalValue * commissionRate + commissionFee;
    displayResult(`Комиссия вывода: ${commission.toFixed(2)}`);
}

function displayResult(message) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = message;
}
