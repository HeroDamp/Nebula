const pdDataFile = DATA_DIR + 'shopmoney.json';
const tcDataFile = DATA_DIR + 'tcards.json';
const symbolsDataFile = DATA_DIR + 'symbolauth.json';
const avatarsDataFile = DATA_DIR + 'shopavatars.json';
const botPhraseDataFile = DATA_DIR + 'botphrases.json';

let fs = require('fs');

if (!fs.existsSync(pdDataFile))	{
	fs.writeFileSync(pdDataFile, '{}');
}

if (!fs.existsSync(tcDataFile))	{
	fs.writeFileSync(tcDataFile, '{}');
}

if (!fs.existsSync(symbolsDataFile))	{
	fs.writeFileSync(symbolsDataFile, '{}');
}

if (!fs.existsSync(avatarsDataFile))	{
	fs.writeFileSync(avatarsDataFile, '{}');
}

if (!fs.existsSync(botPhraseDataFile))	{
	fs.writeFileSync(botPhraseDataFile, '{}');
}

let money = JSON.parse(fs.readFileSync(pdDataFile).toString());
let trainerCards = JSON.parse(fs.readFileSync(tcDataFile).toString());
let customSymbols = JSON.parse(fs.readFileSync(symbolsDataFile).toString());
let boughtAvatars = JSON.parse(fs.readFileSync(avatarsDataFile).toString());
let botPhrase = JSON.parse(fs.readFileSync(botPhraseDataFile).toString());

exports.money = money;
exports.trainerCards = trainerCards;
exports.customSymbols = customSymbols;
exports.boughtAvatars = boughtAvatars;
exports.botPhrase = botPhrase;

function writePdData() {
	fs.writeFileSync(pdDataFile, JSON.stringify(money));
}

function writeTcData() {
	fs.writeFileSync(tcDataFile, JSON.stringify(trainerCards));
}

function writeSymbolsData() {
	fs.writeFileSync(symbolsDataFile, JSON.stringify(customSymbols));
}

function writeAvatarsData() {
	fs.writeFileSync(avatarsDataFile, JSON.stringify(boughtAvatars));
}

function writePhrasesData() {
	fs.writeFileSync(botPhraseDataFile, JSON.stringify(botPhrase));
}

exports.deleteValues = function (text) {
	let textReturn = text;
	textReturn = textReturn.replace("lue=", "kek=");
	textReturn = textReturn.replace("Lue=", "kek=");
	textReturn = textReturn.replace("LUe=", "kek=");
	textReturn = textReturn.replace("lUe=", "kek=");
	textReturn = textReturn.replace("LuE=", "kek=");
	textReturn = textReturn.replace("luE=", "kek=");
	textReturn = textReturn.replace("lUE=", "kek=");
	textReturn = textReturn.replace("LUE=", "kek=");
	return textReturn;
};

exports.getPokemonId = function (text) {
	let textReturn = Tools.escapeHTML(text);
	textReturn = textReturn.toLowerCase();
	textReturn = textReturn.trim();
	return textReturn;
};

//money
exports.getUserMoney = function (user) {
	let userId = toId(user);
	if (!money[userId]) return 0;
	return parseInt(money[userId]);
};

exports.giveMoney = function (user, pds) {
	let userId = toId(user);
	let pokeDolars = parseInt(pds);
	if (!money[userId]) money[userId] = 0;
	money[userId] += pokeDolars;
	writePdData();
	return true;
};

exports.removeMoney = function (user, pds) {
	let userId = toId(user);
	let pokeDolars = parseInt(pds);
	if (!money[userId]) money[userId] = 0;
	if (money[userId] < pokeDolars) return false;
	money[userId] += (-pokeDolars);
	writePdData();
	return true;
};

exports.transferMoney = function (userA, userB, pds) {
	let userAId = toId(userA);
	let userBId = toId(userB);
	let pokeDolars = parseInt(pds);
	if (!money[userAId]) money[userAId] = 0;
	if (!money[userBId]) money[userBId] = 0;
	if (money[userAId] < pokeDolars) return false;
	money[userAId] += (-pokeDolars);
	money[userBId] += pokeDolars;
	writePdData();
	return true;
};
//symbols
exports.symbolPermision = function (user) {
	let userId = toId(user);
	if (!customSymbols[userId]) return false;
	return true;
};

exports.setSymbolPermision = function (user, permision) {
	let userId = toId(user);
	if (permision && !customSymbols[userId]) {
		customSymbols[userId] = 1;
	} else if (!permision && customSymbols[userId]) {
		delete customSymbols[userId];
	} else {
		return false;
	}
	writeSymbolsData();
	return true;
};
//trainer cards
exports.getTrainerCard = function (user) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	return {
		customTC: trainerCards[userId].customTC,
		customHtml: trainerCards[userId].customHtml,
		pokemon: trainerCards[userId].pokemon,
		nPokemon: trainerCards[userId].nPokemon,
		phrase: trainerCards[userId].phrase,
		image: trainerCards[userId].image,
	};
};

exports.giveTrainerCard = function (user) {
	let userId = toId(user);
	if (trainerCards[userId]) return false;
	trainerCards[userId] = {
		customTC: false,
		customHtml: 'Tajeta de Entrenador personalizada. Usa /tchtml para cambiarla a tu gusto.',
		pokemon: {},
		nPokemon: 0,
		phrase: 'Frase de la Tarjeta de Entrenador',
		image: 'http://play.pokemonshowdown.com/sprites/trainers/1.png',
	};
	writeTcData();
	return true;
};

exports.removeTrainerCard = function (user) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	delete trainerCards[userId];
	writeTcData();
	return true;
};

exports.getTrainerCardList = function () {
	let html = 'Lista de TCs: ';
	html += Object.keys(trainerCards).join(", ");
	return html;
};

exports.imageTrainerCard = function (user, image) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	trainerCards[userId].image = image;
	writeTcData();
	return true;
};

exports.phraseTrainerCard = function (user, phrase) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	trainerCards[userId].phrase = phrase;
	writeTcData();
	return true;
};

exports.pokemonTrainerCard = function (user, pokemonData) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	let nPokemonGiven = 0;
	trainerCards[userId].pokemon = {};
	for (let d in pokemonData) {
		if (nPokemonGiven < trainerCards[userId].nPokemon) {
			trainerCards[userId].pokemon[nPokemonGiven] = pokemonData[d];
		}
		++nPokemonGiven;
	}
	writeTcData();
	return true;
};

exports.nPokemonTrainerCard = function (user, value) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	trainerCards[userId].nPokemon = value;
	writeTcData();
	return true;
};

exports.htmlTrainerCard = function (user, htmlSource) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	trainerCards[userId].customHtml = htmlSource;
	writeTcData();
	return true;
};

exports.setCustomTrainerCard = function (user, value) {
	let userId = toId(user);
	if (!trainerCards[userId]) return false;
	trainerCards[userId].customTC = value;
	writeTcData();
	return true;
};
//avatars
exports.addPendingAvatar = function (user, url) {
	let userId = toId(user);
	if (boughtAvatars[userId]) return 'Ya tenias una solicitud de avatar pendiente, espera a que sea revisada por un administrador.';
	boughtAvatars[userId] = url;
	writeAvatarsData();
	return false;
};

exports.deletePendingAvatar = function (user, url) {
	let userId = toId(user);
	if (!boughtAvatars[userId]) return 'El usuario no estaba en la lista de avatares pendientes.';
	delete boughtAvatars[userId];
	writeAvatarsData();
	return false;
};

exports.getPendingAvatars = function () {
	let html = '';
	for (let i in boughtAvatars) {
		html += '<b>' + i + '</b>: <a href="' + boughtAvatars[i] + '">' + boughtAvatars[i] + '</a><br />';
	}
	if (html === '') html = 'No hay avatares pendientes';
	return html;
};
//bot
exports.getBotPhrase = function (user) {
	let userId = toId(user);
	if (botPhrase[userId]) return botPhrase[userId];
	return false;
};

exports.changeBotPhrase = function (user, text) {
	let userId = toId(user);
	if (botPhrase[userId] && toId(text) === 'off') {
		delete botPhrase[userId];
	} else {
		botPhrase[userId] = text;
	}
	writePhrasesData();
};
