console.log('backgound.js loaded!');

var exchangeData = {};

var _TRANSACTION_ALREADY_SYNCED_ = "ტრანზაქცია უკვე დასინქრონებულია";
var _IBANK_TAB_NOT_FOUND_ = "შესანამისი ინტერნეტ ბანკი არ არის გახსნილი";
var _BANK_NOT_SUPPORTED_ = "მოცემული ბანკისთვის კოპირება არ არის ხელმისაწვდომი";

var Ibank_BG = "https://businessonline.ge/Pages/Transactions/Documents/*";
var Ibank_LB = "https://www.lb.ge/ibank/Secure/Payments/*";
var Ibank_PC = "https://online.procreditbank.ge/transplat_int.aspx*";

var Ibank_BG_full = "https://businessonline.ge/Pages/Transactions/Documents/TransferWithinBog.aspx";
var Ibank_LB_full = "https://www.lb.ge/ibank/Secure/Payments/IntraBankPayment.aspx";
var Ibank_PC_full = "https://online.procreditbank.ge/transplat_int.aspx?MenuId=3";

var Ibank_BG_domain = "https://businessonline.ge/*";
var Ibank_LB_domain = "https://www.lb.ge/*";
var Ibank_PC_domain = "https://online.procreditbank.ge/*";


chrome.runtime.onConnect.addListener(function(port) {
  
	port.onMessage.addListener(function(message) {
    			 
		switch( port.name ) {
		 	case "open_tab":

		 		var domain = "";
		 		var domain_full = "";

		 		switch( message.bank_id ){
	        		case '4':
	        			domain = Ibank_BG_domain;
	        			domain_full = Ibank_BG_full;
	        			break;
	        		case '9':
	        			domain = Ibank_LB_domain;
	        			domain_full = Ibank_LB_full; 
	        			break;
	        		case '8':
	        			domain = Ibank_PC_domain;
	        			domain_full = Ibank_PC_full;
	        			break; 
	        	}

	        	if( domain.length > 0 ){
	        		chrome.tabs.query( { url : domain }, function( tabs ){

	        			var url = domain.replace("/*", "");

	        			if( tabs.length == 0 )      				
							chrome.tabs.create({url: domain_full}); 
						else						
							chrome.tabs.update( tabs[0].id, { active : true, url : domain_full } ); 						

		 			});
	        	}	 		

		 		break;
	        case "sync":
	           	
	        	exchangeData = message;
	        	var destination_website = "";

	        	if( message.bank == "BG" ) destination_website = Ibank_BG;
	        	if( message.bank == "LB" ) destination_website = Ibank_LB;
	        	if( message.bank == "PC" ) destination_website = Ibank_PC;

	        	if( destination_website.length == 0 ){
	        		port.postMessage({error: _BANK_NOT_SUPPORTED_}); return;        	
	        	}	        	

	           	chrome.tabs.query( { url : destination_website }, function( tabs ){

		           	if( tabs.length == 0 )
		           		port.postMessage({error: _IBANK_TAB_NOT_FOUND_}); return;					

					var destination_port = chrome.tabs.connect( tabs[0].id, {name: "fill_destination_form"} );	
					destination_port.postMessage( exchangeData );			
					
				} );		  

	        	break;
	        case "clean_cache":	           	
	           	chrome.storage.local.clear(function(){});	
	        	break;
	    }

  	});

});