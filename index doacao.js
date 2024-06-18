const SteamUser = require('steam-user');
//const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

//const Prices = require('./prices.json');
const config = require('./config.json');

const client = new SteamUser;
const community = new SteamCommunity;
const manager = new TradeOfferManager({

	steam : client,
	community: community,
	language: 'en'
});

const logOnOptions = {
	accountName : config.accountName,
	password: config.password
		//twoFactorCode : SteamTotp.generateAuthCode(config.shared_secret)
		//shared secret steamautenticator/steamdesktop/bin/debug/maFiles/"yourID.maFIle"
		//copy your shared secret to yoir config.json "shared_shared_secret"
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	console.log('Logged on Steam.');

	client.setPersona(SteamUser.EPersonaState.Online);
	client.gamesPlayed("Amaya is away", 417860);
});

client.on("friendMessage", function (steamID, message) { 
	 if (message) {
		client.chatMessage(steamID, "Awaya is away :lunar2019deadpanpig:");
            }
});

client.on('webSession', (sessionId, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(20000);//, config.identity_secret
});

/*
            from a especifico ID
manager.on('newOffer', (offer) => {
	if (offer.partner.getSteamID64() === 'ID64AQUI') { 
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
				console.log('Decline offer from unknown user');
			}
		})


function acceptOffer(offer) {
    offer.accept((err) => {
        community.checkConfirmations();
        console.log("We Accepted an offer");
        if (err) console.log("There was an error accepting the offer.");
    });
}

function declineOffer(offer) {
    offer.decline((err) => {
        console.log("We Declined an offer");
        if (err) console.log("There was an error declining the offer.");
    });
}

function processOffer(offer) {
    if (offer.isGlitched() || offer.state === 11) {
        console.log("Offer was glitched, declining.");
        declineOffer(offer);
    } else if (offer.partner.getSteamID64() === config.ownerID) {
        acceptOffer(offer);
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
    }
    console.log("Our value: " + ourValue);
    console.log("Their value: " + theirValue);

    if (ourValue <= theirValue) {
        acceptOffer(offer);
    } else {
        declineOffer(offer);
    }
}

client.setOption("promptSteamGuardCode", false);

manager.on('newOffer', (offer) => {
    processOffer(offer);
});

*/
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