const defaultOptions: LinkFormatOptions = {
  format: "[%{title}](%{url})",
  useHashFormat: true,
  hashFormat: "[%{hashTitle} - %{title}](%{url})",
};

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
  const formatElm = document.getElementById("format") as HTMLInputElement;
  const useHashElm = document.getElementById("use-hash") as HTMLInputElement;
  const hashFormatElm = document.getElementById(
    "hash-format"
  ) as HTMLInputElement;
  const data: LinkFormatOptions = { ...defaultOptions };
  if (formatElm) {
    data.format = formatElm.value;
  }
  if (useHashElm) {
    data.useHashFormat = useHashElm.checked;
    if (useHashElm.checked && hashFormatElm) {
      data.hashFormat = hashFormatElm.value;
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
  const formatElm = document.getElementById("format") as HTMLInputElement;
  chrome.storage.sync.get({ ...defaultOptions }, (items) => {
    const options = items as LinkFormatOptions;
    if (formatElm) {
      formatElm.value = options.format;
    }
    setupUseHashArea(options.useHashFormat, options.hashFormat);
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")?.addEventListener("click", saveOptions);
document.getElementById("use-hash")?.addEventListener("change", (event) => {
  const element = event.target as HTMLInputElement;
  chrome.storage.sync
    .get("hashFormat")
    .then((info) => {
      setupUseHashArea(element.checked, info.hashFormat as string);
    })
    .catch((error) => {
      console.error(error);
    });
});
