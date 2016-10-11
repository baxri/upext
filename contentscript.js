console.log('contentscript.js loaded!');


/*
* Web page emded script
*
*/

document.getElementById("slider-next").addEventListener("click", function() {       	
    window.postMessage({ type: "FROM_UNIPAY", text: "Hello from the webpage!" }, "*");
}, false);



/*
* Works as Content Script
*
*/

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
 
  if ( event.source != window )
    return;

  if (event.data.type && (event.data.type == "FROM_UNIPAY")) {
    console.log("Content script received: " + event.data.text);
   

	chrome.runtime.sendMessage(event.data.text);

    //port.postMessage(event.data.text);
  }
}, false);