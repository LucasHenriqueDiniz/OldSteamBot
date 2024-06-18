const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const Prices = require('./prices.json');
const { accountName, password } = require('./Dados/dados.json');
const EResult = require('steam-tradeoffer-manager/resources/EResult');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({

	steam: client,
	community: community,
	language: 'en'
});


const logOnOptions = {
	accountName : accountName,
	password : password
};

client.logOn(logOnOptions);

console.log('Logging on steam ...');
client.on('loggedOn', () => {

	client.setPersona(SteamUser.EPersonaState.Online, 'Amaya');
	client.gamesPlayed("Amaya is away");
});


client.on("friendMessage", function (steamID, message) { 
	if (message === "!help" && "help") {
		client.chatMessage(steamID, "i can't help you.");
	}
});

client.on('friendRelationship', (steamid, relationship) => {
	if (relationship === 2) {
		client.addFriend(steamid);
		client.chatMessage(steamid, 'Hello! Any specific reason for adding me?');
	}
});

	client.on('webSession', (sessionId, cookies) => {
		manager.setCookies(cookies);

		community.setCookies(cookies);
		community.startConfirmationChecker(15000);
});

	function acceptOffer(offer) {
    	offer.accept((err) => {
       		community.checkConfirmations();
        	console.log("We Accepted an offer");
				if (err) {
				console.log("There was an error accepting the offer.");
				console.log(err);
				}
    });
}

	function declineOffer(offer) {
		offer.decline((err) => {
			if (err === 2 || offer.state === 2 || EResult === 2){
				console.log(`2`);
			} else if (err) {
			console.log(`There was an error declining the offer`);
			console.log(err);
			}
	});
}

	function processOffer(offer) {

		if (offer.isGlitched() || offer.state === 11) {
			console.log("Offer Was glitched, declining.");
			declineOffer(offer);

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
					console.log("Their value was different.")
				}
			}

			console.log("Our value: " + ourValue);
			console.log("Their value: " + theirValue);

			if (ourValue <= theirValue) {
				acceptOffer(offer);
			} else {
				declineOffer(offer);
			}
		}
	}

	/*

			} else if (offer.itemsToGive.length == 0) {
			console.log("Donation detected");
			offer.accept((err, status) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`the offer was ${status}.`);
				}
			});

	manager.on('newOffer', (offer) => {
		//processOffer(offer);
		setTimeout(function(){
			processOffer(offer)
		},5000);
	});
	*/

	client.setOption('promptSteamGuardCode', false);

	manager.on('newOffer', (offer) => {
		if (offer.itemsToGive.length == 0) {
			acceptOffer(offer);
			console.log('donation detected')
			//console.log(`Donation detected. the offer was ${status}.`);
		} else { 
			processOffer(offer); 
		}
	});

	/*
	function check

	if (offer){
		processOffer(offer);
	} else {
		var interval = 1000;

		setInterval(check() => {
			console.log('Zzzz idle');
			check();
		}, interval);
	}*/
//reusar funcao flood para fazer algo que se repete caso na otenha offer
/*
        setTimeout(function(){
            flood();
            var intervalo = 1000; // 1000 = 1seg
            setInterval(function(){ 
                flood();
            }, intervalo)
        })
        function flood(){
            message.channel.send('floodaqui');
        }
    }
*/
	// fazer mensagem de idle
	