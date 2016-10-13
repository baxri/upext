console.log('backgound.js loaded!');

var exchangeData = {};

var _TRANSACTION_ALREADY_SYNCED_ = "ტრანზაქცია უკვე დასინქრონებულია";
var _IBANK_TAB_NOT_FOUND_ = "შესანამისი ინტერნეტ ბანკი არ არის გახსნილი";

var Ibank_BG = "https://businessonline.ge/Pages/Transactions/Documents/*";

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ){	

	 sendResponse("Message Received by background.js");	 

	 switch( message.type ) {
        case "sync":
           	
        	exchangeData = message;

           	chrome.tabs.query( { url : Ibank_BG }, function( tabs ){
			
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