function sendRandomItem() {
	const partner = '76561198083173381';
	const appid = 440;
	const contextid = 2;

	const offer = manager.createOffer(partner);

	manager.loadInventory(appid, contextid, true, (err, myInv) => {
		if (err) {
			console.log(err);
		} else {
			const myItem = myInv[Math.floor(Math.random() * myInv.length - 1)];
			offer.addMyItem(myItem);

			manager.loadUserInventory(
				partner,
				appid,
				contextid,
				true,
				(err, theirInv) => {
					if (err) {
						console.log(err);
					} else {
						const theirItem =
							theirInv[Math.floor(Math.random() * theirInv.length - 1)];
						offer.addTheirItem(theirItem);

						offer.setMessage(
							`Will you trade your ${theirItem.name} for my ${myItem.name}?`
						);
						offer.send((err, status) => {
							if (err) {
								console.log(err);
							} else {
								console.log(`Sent offer. Status: ${status}.`);
							}
						});
					}
				}
			);
		}
	});
}
/*
			offer.addMyItem(item);
			offer.setMessage(`Lucky you! You get a ${item.name}!`);
			offer.send((err, status) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`Sent offer. Status: ${status}.`);
				}
			});
		}
	});
}
*/
/*
  function processOffer(offer) {
if (offer.isGlitched() || offer.state === 11) {
console.log("Offer was glitched, declining.");
declineOffer(offer);
*/