function copyToClipboard(title: string | undefined, url: string) {
  const info = `[${title}](${url})`;
  navigator.clipboard.writeText(info).catch((error) => {
    /* clipboard write failed */
    console.error(`clipboard write failed!!: ${error}`);
  });
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
