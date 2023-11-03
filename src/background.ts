const CopyiedURLNotification = "CopiedURL";
const FailedToCopyURLNotification = "FailedToCopyURL";

function copyToClipboard(title: string | undefined, url: string) {
  const info = `[${title}](${url})`;
  return navigator.clipboard
    .writeText(info)
    .then(() => {
      return info;
    })
    .catch((error) => {
      /* clipboard write failed */
      console.error(`clipboard write failed!!: ${error}`);
      return undefined;
    });
}

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.url === undefined || tab.id === undefined) {
    return;
  }
  if (!tab.url.includes("chrome://")) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: copyToClipboard,
        args: [tab.title, tab.url],
      })
      .then((injectionResults) => {
        for (const { frameId, result } of injectionResults) {
          console.log(`frameId: ${frameId}, result: ${result}`);
          let options: chrome.notifications.NotificationOptions<true>;
          if (result) {
            options = {
              iconUrl: chrome.runtime.getURL("../icon32.png"),
              message: `クリップボードにコピーしました: \n${result}`,
              type: "basic",
              title: "Title and URL Copier",
            };
          } else {
            options = {
              iconUrl: chrome.runtime.getURL("../icon32.png"),
              message: `クリップボードにコピーに失敗しました`,
              type: "basic",
              title: "Title and URL Copier",
            };
          }
          chrome.notifications.create(options);
        }
      });
  }
});
