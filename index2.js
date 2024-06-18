const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const { accountName, password } = require('./Dados/dados.json');
//const { bp_user_token, mp_api_key, bp_api_key } = require('./backpackCODE.json');
const Prices = require('./prices.json');
const client = new SteamUser();
const community = new SteamCommunity();
const offer = theirItems;
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

console.log('Logged on Steam.');
client.on('succesfully logged on.', () => {

	client.setPersona(SteamUser.EPersonaState.Online);
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
	}/* else if (message) {
		client.chatMessage(steamID, "");
	}*/
});

client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(10000);
});



			client.logOn(logOnOptions);

				client.on('loggedOn', () => {
					});

			function acceptOffer(offer) {
				offer.accept((err) => {
					if (err) console.log("There was an error accepting the offer")
						});
					}
					
			function declineOffer(offer) {
				offer.decline((err) => {
					if (err) console.log("There was an error declining the offer")
						});
					}
					

		/*if (offer.isGlitched() || offer.state === 11) {
			console.log("Offer Was glitched, declining.");
			declineOffer(offer);
		} else 	*/if (offer.itemsToGive.length == 0) {
			offer.accept((err, status) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`Offer was a donation. offer was ${status}.`);
				}
			});
				
		} else {
			var ourItems = offer.itemsToGive;
			var theirItems = offer.itemsToReceive;
			var ourValue = 0;
			var theirValue = 0;

			for (var i in ourItems) {
				var item = ourItems[i].market_name;
				if (Prices[item]) {
					ourValue += Prices[item].sell;
				} else {
					console.log("Invalid Value.");
					ourValue += 99999;
				}
			}
			for (var i in theirItems) {
				var item = theirItems[i].market_name;
				if (Prices[item]) {
					theirValue += Prices[item].buy;
				} else {
					console.log(`The value was strange their value = ${theirValue} our value = ${ourValue}.`);
				}
			}

			console.log("Our value: " + ourValue);
			console.log("Their value: " + theirValue);

			if (ourValue <= theirValue) {
				offer.accept(offer);
			} else {
				offer.decline(offer);
			}
		}

		client.setOption("promptSteamGuardCode", false);

		manager.on('newOffer', (offer) => {
			processOffer(offer);
		});