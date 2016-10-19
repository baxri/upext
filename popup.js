//console.log('popup.js loaded!');


window.onload = function() {
    document.getElementById("clean_cache").onclick = function() {
        chrome.runtime.sendMessage( { type: "clean_cache"} );
        window.close();
    }
}