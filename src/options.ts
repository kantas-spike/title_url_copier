const setupUseHashArea = (useHash: boolean, hashFormat?: string) => {
  const useHashChk = document.getElementById("use-hash") as HTMLInputElement;
  const hashFormatInput = document.getElementById(
    "hash-format"
  ) as HTMLInputElement;
  const hashDesc = document.getElementById("hash-format-desc") as HTMLElement;
  if (useHash) {
    useHashChk.checked = true;
    hashFormatInput.disabled = false;
    if (hashFormat) {
      hashFormatInput.value = hashFormat;
    }
    hashDesc.hidden = false;
  } else {
    useHashChk.checked = false;
    hashFormatInput.disabled = true;
    hashDesc.hidden = true;
  }
};

// Saves options to chrome.storage
const saveOptions = () => {
  const format = document.getElementById("format") as HTMLInputElement;
  const useHash = document.getElementById("use-hash") as HTMLInputElement;
  const hashFormat = document.getElementById("hash-format") as HTMLInputElement;
  let data: { [key: string]: any } = {};
  if (format) {
    data.format = format.value;
  }
  if (useHash) {
    data.useHashFormat = useHash.checked;
    if (useHash.checked && hashFormat) {
      data.hashFormat = hashFormat.value;
    }
  }
  chrome.storage.sync.set(data, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    if (status) {
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 1200);
    }
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  const format = document.getElementById("format") as HTMLInputElement;
  chrome.storage.sync.get(
    {
      format: "[${title}](${url})",
      useHashFormat: true,
      hashFormat: "[${hashTitle} - ${title}](${url})",
    },
    (items) => {
      if (format) {
        format.value = items.format;
      }
      setupUseHashArea(items.useHashFormat, items.hashFormat);
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")?.addEventListener("click", saveOptions);
document
  .getElementById("use-hash")
  ?.addEventListener("change", async (event) => {
    const element = event.target as HTMLInputElement;
    const info = await chrome.storage.sync.get("hashFormat");
    setupUseHashArea(element.checked, info.hashFormat);
  });
