function copyToClipboard(title, url) {
  info = `[${title}](${url})`
  navigator.clipboard.writeText(info).then(() => {
    /* clipboard successfully set */
    // console.log("success", info)
  }, () => {
    /* clipboard write failed */
    console.log("clipboard write failed!!")
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToClipboard,
      args: [tab.title, tab.url]
    });
  }
});