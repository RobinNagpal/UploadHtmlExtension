import html2canvas from "html2canvas";
import { DODAO_API_BASE_URL } from "../common/dodao-constants.js";
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
    business.saveTabs([sender.tab], {
      saveWithTidbitsHub: true,
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
  callbackFunction
) {
  sendMethodMessage("dodaoContent.showLoader");

  const fileName = captureHtmlScreenFileName;
  if (!fileName) {
    await sendErrorMessage("Enter File Name");
    return;
  }

  try {
    // Convert blob to file using user input for file name
    const file = new File([blob], fileName, { type: "text/html" });
    const htmlContent = await readFileAsText(file);

    // Manipulate the HTML
    const modifiedHtml = injectScriptLinkTags(htmlContent);

    // Create a new file with the modified HTML
    const editedFile = new File([modifiedHtml], file.name, {
      type: "text/html",
    });

    const { spaceId, apiKey, selectedClickableDemo, selectedTidbitCollection } =
      await getFromStorage([
        "spaceId",
        "apiKey",
        "selectedClickableDemo",
        "selectedTidbitCollection",
      ]);
    const demo = selectedClickableDemo;
    const objectId = demo.title.replace(/\s+/g, "-");

    const input = {
      imageType: "ClickableDemos",
      contentType: file.type,
      objectId: objectId,
      name: file.name,
    };
    console.log(
      "Uploading file to DoDAO",
      spaceId,
      apiKey,
      selectedTidbitCollection,
      selectedClickableDemo
    );
    if (!spaceId || !apiKey) {
      console.log("No data found in chrome.storage");
      return;
    }

    // Get signed URL for uploading the file
    const signedUrl = await getSignedUrl(spaceId, apiKey, input);
    if (!signedUrl) throw new Error("Failed to obtain signed URL");

    // Upload the file to the signed URL
    await uploadFileToSignedUrl(signedUrl, editedFile, file.type);

    const fileUrl = getUploadedImageUrlFromSignedUrl(signedUrl);
    // Optionally, execute the callback function
    const capture = await callbackFunction(
      spaceId,
      apiKey,
      selectedClickableDemo,
      fileUrl,
      fileName,
      htmlContent
    );
    if (capture) {
      await screenCaptured();
    }
  } catch (error) {}
}

// Helper function to read a file as text
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
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
function sendSuccessMessage(message) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { success: message }, resolve);
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

function injectScriptLinkTags(htmlContent) {
  console.log("Injecting script and link tags into HTML content");
  const insertionIndex = findInsertionIndex(htmlContent);

  if (insertionIndex !== undefined) {
    const tags = getScriptLinkTags();
    const modifiedHtml = insertTagsIntoHtml(htmlContent, insertionIndex, tags);
    return modifiedHtml;
  } else {
    console.warn("Unable to find opening style tag in HTML content");
    return htmlContent; // Return unmodified content if the style tag is not found
  }
}

function findInsertionIndex(htmlContent) {
  const styleTagRegex = /<style>/i;
  const match = styleTagRegex.exec(htmlContent);
  return match ? match.index : undefined;
}

function getScriptLinkTags() {
  return [
    `<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/animations/shift-toward.css" />`,
    `<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/material.css" />`,
    `<script src="https://unpkg.com/@popperjs/core@2"></script>`,
    `<script src="https://unpkg.com/tippy.js@6"></script>`,
    `<link rel="stylesheet" href="https://dodao-prod-public-assets.s3.amazonaws.com/clickable-demos-prod-files/clickableDemoTooltipStyles.css" />`,
    `<script src="https://dodao-prod-public-assets.s3.amazonaws.com/clickable-demos-prod-files/clickableDemoTooltipScript.js"></script>`,
    `<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>`,
    getCustomScriptTag(),
  ];
}

function getCustomScriptTag() {
  return `<script>
    console.log("Injecting event listener for clickable demo tooltip");
    window.addEventListener("message", (event) => {
      console.log("Received message from parent", event.data);
      if (typeof window.handleDoDAOParentWindowEvent === "function") {
        window.handleDoDAOParentWindowEvent(event);
      } else {
        console.error("handleDoDAOParentWindowEvent is not defined");
      }
    });
    
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/clickable-demos-prod-files/clickableDemoServiceWorker.js")
      .then(registration => {
        console.log("Service Worker registered with scope:", registration.scope);

        // After registration, send URLs to cache to the Service Worker
        window.addEventListener("load", () => {
          const urlsToCache = Array.from(document.querySelectorAll("link[rel='stylesheet'], script[src]"))
            .map(tag => tag.href || tag.src);

          const filteredUrls = urlsToCache.filter(url => !url.includes("dodao-prod-public-assets"));
          
          console.log("Sending URLs to cache to Service Worker:", filteredUrls);
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: "CACHE_URLS", payload: filteredUrls });
          }
        });
      }).catch(error => {
        console.log("Service Worker registration failed:", error);
      });
    }
  </script>`;
}

function insertTagsIntoHtml(htmlContent, insertionIndex, tags) {
  return [
    htmlContent.slice(0, insertionIndex),
    ...tags,
    htmlContent.slice(insertionIndex),
  ].join("");
}

export async function getScreenshot(
  spaceId,
  apiKey,
  demo,
  url,
  name,
  htmlContent
) {
  const objectId = demo.title.replace(/\s+/g, "-");
  const demoId = demo.demoId;

  const input = {
    imageType: "ClickableDemoHtmlCapture",
    contentType: "image/png",
    objectId: objectId,
    name: `${name}_screenshot`,
  };

  try {
    const iframe = createIframeWithContent(htmlContent);
    document.body.appendChild(iframe);

    return new Promise((resolve, reject) => {
      iframe.onload = async () => {
        try {
          await waitForResourcesToLoad(1000);
          const canvas = await captureScreenshot(iframe);

          if (canvas.width > 0 && canvas.height > 0) {
            const screenshotFile = await canvasToFile(
              canvas,
              "screenshot.png",
              "image/png"
            );
            const screenshotUrl = await uploadScreenshot(
              screenshotFile,
              apiKey,
              spaceId,
              input
            );
            const captureInput = {
              clickableDemoId: demoId,
              fileName: name,
              fileUrl: url,
              fileImageUrl: screenshotUrl,
            };
            const DodaoCapture = await saveDodaoCapture(
              captureInput,
              spaceId,
              apiKey
            );
            resolve(DodaoCapture);
          } else {
            reject(new Error("Canvas has invalid dimensions"));
          }
        } catch (error) {
          console.error("Error capturing screenshot:", error);
          reject(error);
        } finally {
          console.log("Removing iframe");
          document.body.removeChild(iframe); // Clean up the iframe after use
        }
      };
    });
  } catch (error) {
    console.error("Error fetching or processing the content:", error);
    throw error;
  }
}

// Helper function to fetch HTML content from a URL
async function fetchHtmlContent(url) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch the page. Status: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

// Helper function to create an iframe with given HTML content
function createIframeWithContent(htmlContent) {
  const iframe = document.createElement("iframe");
  iframe.style.width = "1920px";
  iframe.style.height = "1080px";
  iframe.style.border = "none";
  iframe.srcdoc = htmlContent;
  return iframe;
}

// Helper function to wait for resources to load
function waitForResourcesToLoad(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Helper function to capture screenshot from an iframe
async function captureScreenshot(iframe) {
  const iframeDocument = iframe.contentDocument;
  const canvas = await html2canvas(iframeDocument.body, {
    width: 1920,
    height: 1080,
    windowWidth: 1920,
    windowHeight: 1080,
    useCORS: true,
    allowTaint: true,
  });
  return canvas;
}

// Helper function to convert canvas to a File object
function canvasToFile(canvas, fileName, fileType) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], fileName, { type: fileType }));
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, fileType);
  });
}

// Helper function to upload the screenshot and get its URL
async function uploadScreenshot(screenshotFile, apiKey, spaceId, input) {
  const signedUrl = await getSignedUrl(spaceId, apiKey, input);
  if (!signedUrl) throw new Error("Failed to obtain signed URL");

  await uploadFileToSignedUrl(signedUrl, screenshotFile, screenshotFile.type);
  const screenshotUrl = getUploadedImageUrlFromSignedUrl(signedUrl);
  return screenshotUrl;
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
    throw new Error("Failed to save the capture");
  }
  const data = await response.json();
  console.log("DoDAO capture saved successfully", data);
  return data;
}

// Assume getSignedUrl, uploadFileToSignedUrl, getUploadedImageUrlFromSignedUrl, and saveDodaoCapture are defined elsewhere
