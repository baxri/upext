console.log('contentscript.js loaded!');

/*
* Send request to the background.js
*
*/

var button = document.getElementById("slider-next");

$(document).ready(function(){

	/*
	* Copy from transactions list 
	*
	*/
	$('.upext-copy').bind('click', function(){		
		console.log('upext-copy click event');
		sendBankInfo(); return false;		
	});

	/*
	* Copy from process popup
	*
	*/

	/*$('.upext-copy-popup').bind('click', function(){
		console.log('upext-copy-popup click event');
		sendBankInfo();			
	});*/

	/*
	* Function for sending info to Ibank page
	*
	*/

	function sendBankInfo(){

		console.log('run sendBankInfo');

		var row = $('.seletced_row');

		var hash_id = row.find('.hash_id').text();
		var iban = row.find('.iban').text();
		var passport = row.find('.passport').text();
		var destination_user = row.find('.destination_user').text();
		var amount = row.find('.amount').text();
		var description = row.find('.description').text();		
		var bank = iban.substr(4, 2);

		var data = {
			"type" : "sync",
			"hash_id" : hash_id,
			"iban" : iban,
			"passport" : passport,
			"destination_user" : destination_user,
			"amount" : amount,
			"description" : description,
			"bank" : bank
		};

		console.log("data is:");
		console.log(data);

		console.log('run chrome.runtime.sendMessage');

		chrome.runtime.sendMessage( data, function( response ){
			console.log(response);
		} );

	}


});

/*
* get error and show notification
*
*/

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
   if( message.error.length > 0 ){
   		alert(message.error);
   }
});


/*
* get message from the background.js
*
*/

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {    		

    switch( message.type ) {
        case "fill-data":
           	
        	console.log( message.data );

           	switch( message.data.bank ){
           		case "BG":           			
           			$("#TextBoxAmount").val(message.data.amount);
					$("#TextBoxCcy").val("GEL");				    
				    $("#ContentPlaceHolderMain_ContentPlaceHolderDocument_TransferWithinBogUserControl_TextBoxComment").val(message.data.description);				   
			    	$("#TextBoxRecipientName").val(message.data.destination_user);
					$("#TextBoxRecipientAccountNo").val(message.data.iban);
					$("#TextBoxRecipientInn").val(message.data.passport);
           			break;
           		case "LB":
           			
           			break;
           		case "TB":
           			
           			break;
           		case "VT":
           			
           			break;
           	}	

        break;
    }
});


