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

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ){	

	 sendResponse("Message Received by background.js");	 

	 switch( message.type ) {
	 	case "open_tab":

	 		var domain = "";
	 		var domain_full = "";

	 		console.log( message.bank_id );

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

        			if( tabs.length == 0 ){	       				
						chrome.tabs.create({url: domain_full}); 
					}else{						
						chrome.tabs.update( tabs[0].id, { active : true } ); 
					}

	 			});
        	}	 		

	 		break;
        case "sync":
           	
        	exchangeData = message;

        	/**
			* Choose destination web site to send data
			*
			**/	

        	var destination_website = "";

        	switch( message.bank ){
        		case "BG":
        			destination_website = Ibank_BG;
        			break;
        		case "LB":
        			destination_website = Ibank_LB;
        			break;
        		case "PC":
        			destination_website = Ibank_PC;
        			break;
        		default:
        			chrome.tabs.sendMessage( sender.tab.id, { 
						error: _BANK_NOT_SUPPORTED_			
					}); return;	
        			break;
        	}

        	console.log( destination_website );

           	chrome.tabs.query( { url : destination_website }, function( tabs ){
			
       		/**
			* Check if Ibank tabs is exsists and throw error
			*
			**/	

           	if( tabs.length == 0 ){	
				chrome.tabs.sendMessage( sender.tab.id, { 
					error: _IBANK_TAB_NOT_FOUND_			
				}); return;	
			}

			chrome.storage.local.get( "hashes", function( result ){

				var  hashes = result.hashes
		       		
				/**
				* if hashed array is empty intialize new one	
				*
				**/
				if ( typeof hashes == 'undefined' ){
					hashes = [];
				}

				/**
				* Check if this hash_id already was synced
				*
				**/			
				var alreadySynced = hashes.indexOf( exchangeData.hash_id );			

				if( alreadySynced > -1 ){
					chrome.tabs.sendMessage( sender.tab.id, { 
						error: exchangeData.hash_id + " " + _TRANSACTION_ALREADY_SYNCED_				
					});	return;
				}	

				/**
				* Add this hash_id to the array 
				*
				**/	

		       	hashes.push(exchangeData.hash_id);	       

		       	/**
				* Save array in local storage
				*
				**/	

		        chrome.storage.local.set({ "hashes": hashes}, function() {         
		          console.log( exchangeData.hash_id  + " saved in local storage" );
		        });

				chrome.tabs.sendMessage( tabs[0].id, { 
					error: "",  
					type: "fill-data", 
					data : exchangeData 
				}, function( responseFromContent ){
					console.log("Message Sent to Destination Content");
				});				

		    });
			
			
		} );		  

        	break;
        case "clean_cache":
           	
           	chrome.storage.local.clear(function(){
           		console.log("ლოკალური მეხსიერება გასუფთავებულია");
           	});	

        	break;
    }
	
	
});