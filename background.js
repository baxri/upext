console.log('backgound.js loaded!');

var exchangeData = {};

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ){	

	exchangeData = message;

	chrome.tabs.query( { url : "https://businessonline.ge/Pages/Transactions/Documents/*"}, function( tabs ){
		chrome.tabs.sendMessage( tabs[0].id, {type: "fill-data", data : exchangeData });
	} );	


	sendResponse(exchangeData);
});