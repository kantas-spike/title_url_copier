// Saves options to chrome.storage
const saveOptions = () => {
  console.log("saveOptions");
  const formatElm = document.getElementById("format") as HTMLInputElement;
  if (formatElm) {
    chrome.storage.sync.set({ format: formatElm.value }, () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      if (status) {
        status.textContent = "Options saved.";
        console.log("   Options saved!");
        setTimeout(() => {
          status.textContent = "";
        }, 1200);
      }
    });
  }
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  console.log("restoreOptions!!");
  chrome.storage.sync.get({ format: "[${title}](${url})" }, (items) => {
    const format = document.getElementById("format") as HTMLInputElement;
    if (format) {
      format.value = items.format;
    }
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")?.addEventListener("click", saveOptions);
