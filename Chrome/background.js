var wikiIdentifier = 'wikipedia.org/wiki'
var igIdentifier = 'infogalactic.com/info'
var redirectedArray = {}
var sourceURL //declare source url for storing url to go back to.

function prepForEntry (url) {
	url = url.replace('.m', '') // Sanitise Mobile sites.
	sourceURL=url // remember source url
  return url.replace(/https:\/\/.+?\./, 'https://')
}


chrome.browserAction.onClicked.addListener(
  function (tab) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function (tabs) {
        var activeTab = tabs[0]
        var currentURL = activeTab.url
        redirectedArray[activeTab.id] = 'disallowRedirect'


      if (currentURL.includes(wikiIdentifier)) {
			currentURL = currentURL.replace('.m', '') // Sanitise Mobile sites.
	                sourceURL = currentURL // remember source url
			currentURL = currentURL.replace(/https:\/\/.+?\./, 'https://')
			var igURL = currentURL.replace(wikiIdentifier, igIdentifier)
			chrome.tabs.update({'url': igURL})
			}

        if (currentURL.includes(igIdentifier)) {
          chrome.tabs.update({'url': sourceURL})
        }
      })
  }
)

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!(details.tabId in redirectedArray)) {
      redirectedArray[details.tabId] = 'allowRedirect'
    }
    if (redirectedArray[details.tabId] === 'allowRedirect') {
      return {
        redirectUrl: prepForEntry(details.url).replace(wikiIdentifier, igIdentifier)
      }
    }
  },
  {urls: ['*://*.wikipedia.org/*'], types: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'object', 'xmlhttprequest', 'other']},
  ['blocking']
)

chrome.tabs.onUpdated.addListener(
  function (tabid, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log(redirectedArray)
      if (!tab.url.includes(wikiIdentifier) && !tab.url.includes(igIdentifier)) {
        redirectedArray[tabid] = 'allowRedirect'
      }
    }
  }
)
