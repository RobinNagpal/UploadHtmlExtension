import {DODAO_API_BASE_URL, slugify} from "../common/dodao-utils.js";

let business;
export function init(businessApi) {
  business = businessApi;
}

export async function onMessage(message, sender) {
  if (message.method.endsWith("saveSpaceIdAndApiKey")) {
    saveSpaceIdAndApiKey(message);
    return {};
  }
  if (message.method.endsWith("saveSelectedClickableDemo")) {
    saveSelectedCollectionAndDemoId(message);
    return {};
  }
  if (message.method.endsWith("logout")) {
    logout();
    return {};
  }
  if (message.method.endsWith("captureScreenClicked")) {
    captureScreenClicked();
    return {};
  }
  if (message.method.endsWith("savePage")) {
    savePage(message, sender);
    return {};
  }
  if (message.method.endsWith("changeCollectionClicked")) {
    changeCollectionClicked();
    return {};
  }
  if (message.method.endsWith("changeDemoClicked")) {
    changeDemoClicked(message);
    return {};
  }
  if (message.method.endsWith("cancelCaptureHtmlScreenClicked")) {
    cancelCaptureHtmlScreenClicked(message);
    return {};
  }
}

export async function dodaoExtensionIconClicked(tab) {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);
  chrome.storage.local.set({ dodaoExtActiveTabId: tab.id });
  if (!spaceId || !apiKey) {
    sendMethodMessage("dodaoContent.captureApiKey");
  } else if (!selectedClickableDemo || !selectedTidbitCollection) {
    sendMethodMessage("dodaoContent.selectClickableDemo", {
      spaceId: spaceId,
      apiKey: apiKey,
      selectedClickableDemo: selectedClickableDemo,
      selectedTidbitCollection: selectedTidbitCollection,
    });
  } else if (
    spaceId &&
    apiKey &&
    selectedClickableDemo &&
    selectedTidbitCollection
  ) {
    sendMethodMessage("dodaoContent.renderBottomBar", {
      spaceId,
      apiKey,
      selectedClickableDemo,
      selectedTidbitCollection,
    });
  }
}

// Helper function to get data from chrome.storage
export function getFromStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
    });
  });
}

async function captureScreenClicked() {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);

  sendMethodMessage("dodaoContent.captureScreenHtml", {
    spaceId,
    apiKey,
    selectedClickableDemo,
    selectedTidbitCollection,
  });
}
function logout() {
  chrome.storage.local.remove([
    "spaceId",
    "apiKey",
    "selectedClickableDemo",
    "selectedTidbitCollection",
    "dodaoExtActiveTabId",
  ]);
  sendMethodMessage("dodaoContent.captureApiKey");
}

async function changeCollectionClicked() {
  const { spaceId, apiKey } = await getFromStorage(["spaceId", "apiKey"]);
  chrome.storage.local.set({
    selectedTidbitCollection: null,
    selectedClickableDemo: null,
  });
  sendMethodMessage("dodaoContent.selectClickableDemo", {
    spaceId: spaceId,
    apiKey: apiKey,
  });
}

async function changeDemoClicked(message) {
  console.log("changeDemoClicked", message);
  const { spaceId, apiKey } = await getFromStorage(["spaceId", "apiKey"]);
  chrome.storage.local.set({
    selectedTidbitCollection: message.data.selectedTidbitCollection,
    selectedClickableDemo: null,
  });
  sendMethodMessage("dodaoContent.selectClickableDemo", {
    spaceId: spaceId,
    apiKey: apiKey,
    selectedTidbitCollection: message.data.selectedTidbitCollection,
    selectedClickableDemo: null,
  });
}

async function savePage(message, sender) {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);
    if (message.data.captureHtmlScreenFileName) {
    sendMethodMessage("dodaoContent.showLoader");
    business.saveTabs([sender.tab], {
      compressContent: true,
      selfExtractingArchive: false,
      saveWithTidbitsHub: true,
      createRootDirectory: false,
      captureHtmlScreenFileName: message.data.captureHtmlScreenFileName,
    });
  } else {
    sendMethodMessage("dodaoContent.captureScreenHtml", {
      error: "Filename is required",
      spaceId,
      apiKey,
      selectedClickableDemo,
      selectedTidbitCollection,
    });
  }
}

function saveSpaceIdAndApiKey(message) {
  if (message.data.spaceId && message.data.apiKey) {
    chrome.storage.local.set({
      spaceId: message.data.spaceId,
      apiKey: message.data.apiKey,
    });
    sendMethodMessage("dodaoContent.selectClickableDemo", {
      spaceId: message.data.spaceId,
      apiKey: message.data.apiKey,
    });
  } else {
    sendMethodMessage("dodaoContent.captureApiKey", {
      error: "SpaceId and apiKey are required",
    });
  }
}

async function screenCaptured() {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);

  sendMethodMessage("dodaoContent.renderBottomBar", {
    spaceId,
    apiKey,
    selectedClickableDemo,
    selectedTidbitCollection,
    screenCaptured: true,
  });
}

async function uploadingErrorCaptured(message) {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);

  sendMethodMessage("dodaoContent.renderBottomBar", {
    spaceId,
    apiKey,
    selectedClickableDemo,
    selectedTidbitCollection,
    error: message || "Failed to upload file. Please Try again"
  });
}
async function saveSelectedCollectionAndDemoId(message) {
  const { spaceId, apiKey } = await getFromStorage(["spaceId", "apiKey"]);
  if (
    message.data.selectedTidbitCollection &&
    message.data.selectedClickableDemo
  ) {
    chrome.storage.local.set({
      selectedTidbitCollection: message.data.selectedTidbitCollection,
      selectedClickableDemo: message.data.selectedClickableDemo,
    });
    sendMethodMessage("dodaoContent.renderBottomBar", {
      selectedClickableDemo: message.data.selectedClickableDemo,
      selectedTidbitCollection: message.data.selectedTidbitCollection,
      spaceId,
      apiKey,
    });
  } else {
    sendMethodMessage("dodaoContent.selectClickableDemo", {
      spaceId: spaceId,
      apiKey: apiKey,
      error: "Select the demo and collection again",
    });
  }
}

async function cancelCaptureHtmlScreenClicked(message) {
  const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
    await getFromStorage([
      "spaceId",
      "apiKey",
      "selectedClickableDemo",
      "selectedTidbitCollection",
    ]);

  sendMethodMessage("dodaoContent.renderBottomBar", {
    spaceId,
    apiKey,
    selectedClickableDemo,
    selectedTidbitCollection,
  });
}

export async function uploadFileToDodao(
  captureHtmlScreenFileName,
  blob,
  screenshotBlob
) {

  const fileName = captureHtmlScreenFileName;
  if (!fileName) {
    await sendErrorMessage("Enter File Name");
    return;
  }

  try {
    // Convert blob to file using user input for file name
    const slugifiedFileName = slugify(fileName);
    const zipFile = new File([blob], slugifiedFileName + ".zip", { type: "application/zip"});
    const screenShotFile = new File([screenshotBlob], fileName + "screenshot.png", { type: "image/png" });

    const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
      await getFromStorage([
        "spaceId",
        "apiKey",
        "selectedClickableDemo",
        "selectedTidbitCollection",
      ]);
    const demo = selectedClickableDemo;
    console.log('selectedClickableDemo', selectedClickableDemo)
    const objectId = demo.title.replace(/\s+/g, "-");


    console.log(
      "Uploading file to DoDAO",
      {
        demo,
        spaceId,
        apiKey,
        selectedTidbitCollection,
        selectedClickableDemo
      }
    );
    if (!spaceId || !apiKey) {
      console.log("No data found in chrome.storage");
      return;
    }

    // Get signed URL for uploading the file

    const zipFileSignedUrlInput = {
      contentType: zipFile.type,
      name: zipFile.name,
    };


    const zipSignedUrl = await getZippedFileSignedUrl(spaceId, selectedClickableDemo.demoId, apiKey, zipFileSignedUrlInput);

    console.log("zipSignedUrl - ", zipSignedUrl || 'No signed URL found') ;

    if (!zipSignedUrl) uploadingErrorCaptured();

    // Upload the file to the signed URL
    await uploadFileToSignedUrl(zipSignedUrl, zipFile, zipFile.type);

    const fileUrl = getUploadedImageUrlFromSignedUrl(zipSignedUrl);
    // Optionally, execute the callback function

    const screenshotSignedUrlInput = {
      imageType: "ClickableDemoHtmlCapture",
      contentType: screenShotFile.type,
      objectId: objectId,
      name: screenShotFile.name,
    };

    const htmlScreenshotSignedUrl = await getSignedUrl(spaceId, apiKey, screenshotSignedUrlInput);
    if (!htmlScreenshotSignedUrl) throw new Error("Failed to obtain signed URL");

    // Upload the file to the signed URL
    await uploadFileToSignedUrl(htmlScreenshotSignedUrl, screenShotFile, screenShotFile.type);

    const fileImageUrl = getUploadedImageUrlFromSignedUrl(htmlScreenshotSignedUrl);
    // Optionally, execute the callback function

    console.log("File uploaded successfully", fileUrl, fileImageUrl);
    const captureInput = {
      clickableDemoId: demo.demoId,
      fileName: fileName,
      fileUrl: fileUrl.replace('zipped-html-captures', 'unzipped-html-captures').replace('.zip', '/index.html'),
      fileImageUrl: fileImageUrl,
    };
    const dodaoCapture = await saveDodaoCapture(
      captureInput,
      spaceId,
      apiKey
    );

    if (dodaoCapture) {
      await screenCaptured();
    }
  } catch (error) {}
}

function sendMethodMessage(method, data) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(
          tabs[0].id,
          { method: method, data: data },
          resolve
        );
      } else {
        resolve();
      }
    });
  });
}

// Helper function to send an error message to the active tab
function sendErrorMessage(message) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { error: message }, resolve);
      } else {
        resolve();
      }
    });
  });
}

// Helper function to get a signed URL for uploading
async function getSignedUrl(spaceId, apiKey, input) {
  const response = await fetch(`${DODAO_API_BASE_URL}/api/s3-signed-urls`, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spaceId, input }),
  });

  if (!response.ok) {
    uploadingErrorCaptured()
    return null;
  }

  const data = await response.json();
  return data.url;
}

async function getZippedFileSignedUrl(spaceId, demoId, apiKey, input) {
  const url = `${DODAO_API_BASE_URL}/api/${spaceId}/actions/clickable-demos/${demoId}/html-capture-signed-url`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    console.error( `Failed to get signed URL - ${url} - `, response.status, response.statusText);
    uploadingErrorCaptured()
    return null;
  }

  const data = await response.json();
  return data.url;
}
// Helper function to upload a file to a signed URL
function uploadFileToSignedUrl(url, file, contentType) {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });
}

// Assume this function exists as per original code
function getUploadedImageUrlFromSignedUrl(signedUrl) {
  // Implement the logic to derive the uploaded file URL from the signed URL
  return signedUrl.split("?")[0]; // Example implementation
}




async function saveDodaoCapture(input, spaceId, apiKey) {
  console.log("Saving DoDAO capture", input);
  const response = await fetch(
    `${DODAO_API_BASE_URL}/api/${spaceId}/html-captures`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    }
  );

  if (!response.ok) {
    uploadingErrorCaptured("Failed to save the capture. Please Try Again")
    throw new Error("Failed to save the capture");
  }
  const data = await response.json();
  console.log("DoDAO capture saved successfully", data);
  return data;
}

// Assume getSignedUrl, uploadFileToSignedUrl, getUploadedImageUrlFromSignedUrl, and saveDodaoCapture are defined elsewhere
