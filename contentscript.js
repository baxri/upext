console.log('contentscript.js loaded!');

/*
* Send request to the background.js
*
*/

var button = document.getElementById("slider-next");

$(document).ready(function(){

	$('.uptest').bind('click', function(){
		

		var row = $(this).closest('.seletced_row');

		var hash_id = row.find('.hash_id').text();
		var iban = row.find('.iban').text();
		var passport = row.find('.passport').text();
		var destination_user = row.find('.destination_user').text();
		var amount = row.find('.amount').text();
		var description = row.find('.description').text();

		var data = {
			"hash_id" : hash_id,
			"iban" : iban,
			"passport" : passport,
			"destination_user" : destination_user,
			"amount" : amount,
			"description" : description
		};

		chrome.runtime.sendMessage( data, function(response) {
			  console.log(response);
		});

		return false;

	});

});




/*
* get message from the background.js
*
*/

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    	

	console.log(message);

    switch( message.type ) {
        case "fill-data":
           			
        
	    $("#TextBoxAmount").val(message.data.amount);
		$("#TextBoxCcy").val("GEL");
	    
	    $("#ContentPlaceHolderMain_ContentPlaceHolderDocument_TransferWithinBogUserControl_TextBoxComment").val(message.data.description);
	   
    	$("#TextBoxRecipientName").val(message.data.destination_user);
		$("#TextBoxRecipientAccountNo").val(message.data.iban);
		$("#TextBoxRecipientInn").val(message.data.passport);
            

        break;
    }
});


