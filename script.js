'use strict';

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200.0, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2021-06-01T17:01:17.194Z',
		'2021-06-02T23:36:17.929Z',
		'2021-06-03T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (account, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

	movs.forEach((mov, i) => {
		mov = mov.toFixed(2);

		const now = new Date(account.movementsDates[i]);
		const month = `${now.getMonth() + 1}`.padStart(2, '0');
		const date = `${now.getDate()}`.padStart(2, '0');
		const year = now.getFullYear();

		const timeStamp = `${month}/${date}/${year}`;

		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div> 
                <div class="movements__date">${timeStamp}</div>
                <div class="movements__value">${mov < 0 ? (mov = `-$${mov.toString().slice(1)}`) : (mov = `$${mov}`)}</div>
            </div>
        `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

// Calculate and display balance

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, cur) => {
		return acc + cur;
	}, 0);

	labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
};

const createUserName = function (accs) {
	accs.forEach(acc => {
		acc.userName = acc.owner
			.toLowerCase()
			.split(' ')
			.map(letter => letter[0])
			.join('');
	});
};

createUserName(accounts);

const calcDisplaySummary = function (account) {
	const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov);

	const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov);
	const interest = account.movements
		.filter(mov => mov > 0)
		.map(mov => (mov * account.interestRate) / 100)
		.filter(mov => mov >= 1)
		.reduce((acc, mov) => acc + mov);

	labelSumIn.textContent = `$${incomes.toFixed(2)}`;
	labelSumOut.textContent = `-$${Math.abs(out).toFixed(2)}`;
	labelSumInterest.textContent = `$${interest.toFixed(2)}`;
};

// Event handlers
let currentAccount;

const updateUI = function (currentAccount) {
	displayMovements(currentAccount);
	calcDisplayBalance(currentAccount);
	calcDisplaySummary(currentAccount);
};

////////////////////// FAKE LOGIN ///////////////////////////////////////////////////////////////

// currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
currentAccount = account1;

// if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
// Display UI and message
labelWelcome.textContent = `Welcom back, ${currentAccount.owner.split(' ')[0]}`;
containerApp.style.opacity = 100;
updateUI(currentAccount);
inputLoginUsername.value = '';
inputLoginPin.value = '';
inputLoginPin.blur();
// } else {
// containerApp.style.opacity = 0;
// }

const startTime = (function () {
	const now = new Date();
	const month = `${now.getMonth() + 1}`.padStart(2, '0');
	const date = `${now.getDate()}`.padStart(2, '0');
	const year = now.getFullYear();
	const hour = now.getHours();
	const minute = now.getMinutes();
	const second = now.getSeconds();
	labelDate.textContent = `${month}/${date}/${year}, ${hour}:${minute}:${second} `;

	setInterval(() => {
		const now = new Date();
		const month = `${now.getMonth() + 1}`.padStart(2, '0');
		const date = `${now.getDate()}`.padStart(2, '0');
		const year = now.getFullYear();
		const hour = now.getHours();
		const minute = now.getMinutes();
		const second = now.getSeconds();
		labelDate.textContent = `${month}/${date}/${year}, ${hour}:${minute}:${second} `;
	}, 1000);
})();

// btnLogin.addEventListener('click', function (e) {
// 	e.preventDefault();

// 	currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

// 	if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
// 		// Display UI and message
// 		labelWelcome.textContent = `Welcom back, ${currentAccount.owner.split(' ')[0]}`;
// 		containerApp.style.opacity = 100;
// 		updateUI(currentAccount);
// 		inputLoginUsername.value = '';
// 		inputLoginPin.value = '';
// 		inputLoginPin.blur();
// 	} else {
// 		containerApp.style.opacity = 0;
// 	}
// });

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = +inputTransferAmount.value;
	const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
	inputTransferAmount.value = '';
	inputTransferTo.value = '';

	if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName) {
		currentAccount.movements.push(+-amount);
		console.log(currentAccount.movements);
		receiverAcc.movements.push(amount);
		updateUI(currentAccount);
	}
});

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
		currentAccount.movements.push(amount);
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	if (inputCloseUsername.value === currentAccount.userName && +inputClosePin.value === currentAccount.pin) {
		const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
		accounts.splice(index, 1);
		containerApp.style.opacity = 0;
	}
	inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();

	displayMovements(currentAccount, !sorted);

	sorted = !sorted;
});

/////////////////// Dates //////////////////
