console.log('contentscript.js loaded!');


var button = document.getElementById("slider-next");

$(document).ready(function(){	

	$('#category').change(function(){

		var bank_id = $(this).val();

		var data = {			
			"bank_id" : bank_id,			
		};

		var port = chrome.runtime.connect({name: "open_tab"});		
		port.postMessage(data);
		
		return false;
	});
	

	$('.upext-copy').bind('click', function(){				
		sendBankInfo(); return false;		
	});
	

	function sendBankInfo(){

		var row = $('.seletced_row');

		var hash_id = row.find('.hash_id').text();
		var iban = row.find('.iban').text();
		var passport = row.find('.passport').text();
		var destination_user = row.find('.destination_user').text();
		var amount = row.find('.amount').text();
		var description = row.find('.description').text();		
		var bank = iban.substr(4, 2);

		var data = {			
			"hash_id" : hash_id,
			"iban" : iban,
			"passport" : passport,
			"destination_user" : destination_user,
			"amount" : amount,
			"description" : description,
			"bank" : bank
		};
		
		var port = chrome.runtime.connect({name: "sync"});		
		port.postMessage(data);

		port.onMessage.addListener(function(msg) {		  
			if( msg.error.length > 0 ){
				alert(msg.error);
			}
		});
	}

});


chrome.runtime.onConnect.addListener(function( port ){

	port.onMessage.addListener(function(message){

		switch( port.name ) {
	        case "fill_destination_form":

	           	switch( message.bank ){
	           		case "BG":           			
	           			$("#TextBoxAmount").val(message.amount);
						$("#TextBoxCcy").val("GEL");				    
					    $("#ContentPlaceHolderMain_ContentPlaceHolderDocument_TransferWithinBogUserControl_TextBoxComment").val(message.description);				   
				    	$("#TextBoxRecipientName").val(message.destination_user);
						$("#TextBoxRecipientAccountNo").val(message.iban);
						$("#TextBoxRecipientInn").val(message.passport);
	           			break;
	           		case "LB":           			
	           			$("#ddlUsersAccounts").val("15481");	
	           			$("#txtPaymentsSum").val(message.amount);	
	           			$("#txtPaymentsRecName").val(message.destination_user);	
	           			$("#txtPaymentsRecIDNr").val(message.passport);	
	           			$("#txtPaymentsRecAccountNr").val(message.iban);	
	           			$("#txtPaymentsPurposeDescr").val(message.description);
	           			break;
	           		case "PC":
	           			$("#ctl00_ctl00_body_Childe_ReceiverAccount_I").val(message.iban);	
	           			$("#ctl00_ctl00_body_Childe_tbSum").val(message.amount);	
	           			$("#ctl00_ctl00_body_Childe_ASPxCallbackPanel4_tbAim_I").val(message.description);	
	           			break;   
	           		default:
	           			
	           			break;        		
	           	}	

	        break;
	    }

	});

});
