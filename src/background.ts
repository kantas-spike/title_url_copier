function copyToClipboard(
  title: string | undefined,
  url: string,
  options: LinkFormatOptions
) {
  function getHashTargetTextFromUrl(_url: string) {
    const targetURL = new URL(_url);
    const { hash } = targetURL;
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
    }
    return targetString;
  }

  function populateTemplate(
    _title: string | undefined,
    _url: string,
    _options: LinkFormatOptions
  ) {
    const hashTargetText = getHashTargetTextFromUrl(_url);
    const { format, hashFormat } = _options;
    if (hashTargetText && _options.useHashFormat) {
      return hashFormat
        .replaceAll("%{title}", _title ?? "")
        .replaceAll("%{url}", _url)
        .replaceAll("%{hashTitle}", truncateString(hashTargetText));
    }
    return format
      .replaceAll("%{title}", _title ?? "")
      .replaceAll("%{url}", _url);
  }

  const info = populateTemplate(title, url, options);
  return navigator.clipboard
    .writeText(info)
    .then(() => info)
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
  if (tab.url.includes("chrome://")) {
    return;
  }

  chrome.storage.sync
    .get()
    .then((options) =>
      chrome.scripting.executeScript({
        target: { tabId: tab.id as number },
        func: copyToClipboard,
        args: [tab.title, tab.url as string, options as LinkFormatOptions],
      })
    )
    .then((injectionResults) => {
      injectionResults.forEach(({ result }) => {
        let notificationOptions: chrome.notifications.NotificationOptions<true>;
        if (result) {
          notificationOptions = {
            iconUrl: chrome.runtime.getURL("../icon32.png"),
            message: `クリップボードにコピーしました: \n${result}`,
            type: "basic",
            title: "Title and URL Copier",
          };
        } else {
          notificationOptions = {
            iconUrl: chrome.runtime.getURL("../icon32.png"),
            message: "クリップボードにコピーに失敗しました",
            type: "basic",
            title: "Title and URL Copier",
          };
        }
        chrome.notifications.create(notificationOptions);
      });
    })
    .catch((error) => {
      console.error(error);
    });
});
