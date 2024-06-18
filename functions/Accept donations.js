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