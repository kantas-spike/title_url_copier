function copyToClipboard(title: string | undefined, url: string) {
  const info = `[${title}](${url})`;
  navigator.clipboard.writeText(info).then(
    () => {
      /* clipboard successfully set */
      // console.log("success", info)
    },
    () => {
      /* clipboard write failed */
      console.log("clipboard write failed!!");
    }
  );
}

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.url === undefined || tab.id === undefined) {
    return;
  }
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyToClipboard,
      args: [tab.title, tab.url],
    });
  }
});
