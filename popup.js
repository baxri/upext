//console.log('popup.js loaded!');


window.onload = function() {
    document.getElementById("clean_cache").onclick = function() {       

        var port = chrome.runtime.connect({name: "clean_cache"});		
		port.postMessage({});

        window.close();
    }
}