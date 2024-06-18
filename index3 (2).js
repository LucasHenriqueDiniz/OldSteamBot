const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const { accountName, password } = require('./Dados/dados.json');
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({

	steam: client,
	community: community,
	language: 'en'
});


const logOnOptions = {
	accountName: accountName,
	password: password

};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	console.log('Logged into Steam');

	client.setPersona(SteamUser.EPersonaState.Online, 'Amaya');
	client.gamesPlayed("Amaya is away", 417860);
});

client.on('friendRelationship', (steamid, relationship) => {
	if (relationship === 2) {
		client.addFriend(steamid);
		client.chatMessage(steamid, 'Hello ! Any specific reason for adding me?');
	}
});

client.on("friendMessage", function (steamID, message) { 
	if (message == "!help" && "!h") {
		client.chatMessage(steamID, "this bot is stupid .-.");
	}
});

client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(15000);
});

manager.on('newOffer', (offer) => {
	if (offer.itemsToGive.length == 0) {
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`Accept offer. Status: ${status}.`);
			}
		});
	} else {
		offer.decline((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Declined offer. Reason : Not a donation")
			}
		});
	}
});