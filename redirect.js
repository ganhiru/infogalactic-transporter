chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      var firstHref = $("a[href^='http']").eq(0).attr("href");


      console.log('I have the URL and it is', request.currentURL)
      // This line is new!

        // chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});

    }
  }
);
