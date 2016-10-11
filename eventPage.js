console.log('eventPage.js loaded!');


chrome.runtime.onMessage.addListener(function( data ){

	console.log(data);


});