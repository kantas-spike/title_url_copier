const CopyiedURLNotification = "CopiedURL";
const FailedToCopyURLNotification = "FailedToCopyURL";

function copyToClipboard(
  title: string | undefined,
  url: string,
  options: { [key: string]: any }
) {
  function getHashTargetTextFromUrl(url: string) {
    const targetURL = new URL(url);
    const hash = targetURL.hash;
    const hashId = decodeURIComponent(hash.replace("#", ""));
    const targetFragment = document.getElementById(hashId);
    return targetFragment?.innerText.replace(/[\n\r]+|[\s]{2,}/g, " ");
  }

  function truncateString(
    targetString: string,
    maxLength = 24,
    truncatedSuffix = "..."
  ) {
    if (targetString.length > maxLength) {
      const truncatedString = targetString.slice(
        0,
        maxLength - truncatedSuffix.length
      );
      return truncatedString + truncatedSuffix;
    } else {
      return targetString;
    }
  }

  function populateTemplate(
    title: string | undefined,
    url: string,
    options: { [key: string]: any }
  ) {
    const hashTargetText = getHashTargetTextFromUrl(url);
    if (hashTargetText && options.useHashFormat) {
      return options.hashFormat
        .replaceAll("${title}", title ?? "")
        .replaceAll("${url}", url)
        .replaceAll("${hashTitle}", truncateString(hashTargetText));
    } else {
      return options.format
        .replaceAll("${title}", title ?? "")
        .replaceAll("${url}", url);
    }
  }

  const info = populateTemplate(title, url, options);
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

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (tab.url === undefined || tab.id === undefined) {
    return;
  }
  const url = new URL(tab.url);
  const options = await chrome.storage.sync.get();

  if (!tab.url.includes("chrome://")) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: copyToClipboard,
        args: [tab.title, tab.url, options],
      })
      .then((injectionResults) => {
        for (const { frameId, result } of injectionResults) {
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
