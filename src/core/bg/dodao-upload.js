export async function uploadFileToDodao(simulationOptions, blob, callbackFunction) {
  console.log("Uploading file to DoDAO", simulationOptions, blob);

  const fileName = simulationOptions.fileName;
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
    const editedFile = new File([modifiedHtml], file.name, { type: "text/html" });

    const input = {
      imageType: "ClickableDemos",
      contentType: file.type,
      objectId: simulationOptions.objectId,
      name: file.name,
    };

    console.log(input);

    // Fetch 'spaceId' and 'apiKey' from chrome.storage
    const { spaceId, apiKey } = await getFromStorage(["spaceId", "apiKey"]);
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
    console.log("File uploaded successfully:", fileUrl);
    sendSuccessMessage("File uploaded successfully");

    // Optionally, execute the callback function
    if (callbackFunction) callbackFunction(fileUrl);
  } catch (error) {
    console.error("Error uploading file:", error);
    await sendErrorMessage("Failed to upload the File");
  }
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

// Helper function to get data from chrome.storage
function getFromStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
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
  const response = await fetch("http://localhost:3000/api/s3-signed-urls", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spaceId, input }),
  });

  if (!response.ok) {
    await sendErrorMessage("Failed to upload the File");
    return null;
  }

  const data = await response.json();
  console.log("Signed URL:", data.url);
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
  // Regular expression for matching the opening style tag
  const closingHeadRegex = /<style>/i;

  // Find the position to insert the tags (before the opening style tag)
  const headEndTagIndex = closingHeadRegex.exec(htmlContent)?.index;

  if (headEndTagIndex) {
    // Construct the script and link tags with a timestamp
    const timestamp = new Date().getTime();
    const linkTag2 = `<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/animations/shift-toward.css" />`;
    const linkTag3 = `<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/material.css" />`;
    const scriptTag1 = `<script src="https://unpkg.com/@popperjs/core@2"></script>`;
    const scriptTag2 = `<script src="https://unpkg.com/tippy.js@6"></script>`;
    const html2CanvasScript = ` <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>`;
    const customLinkTag = `<link rel="stylesheet" href="https://dodao-prod-public-assets.s3.amazonaws.com/clickable-demos-prod-files/clickableDemoTooltipStyles.css" />`;
    const customScriptTag = `<script src="https://dodao-prod-public-assets.s3.amazonaws.com/clickable-demos-prod-files/clickableDemoTooltipScript.js"></script>`;
    const scriptTagCustom = `<script>
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
                  const urlsToCache = Array.from(document.querySelectorAll("link[rel=\'stylesheet\'], script[src]"))
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

    // Insert the tags before the opening style tag
    const modifiedHtml = [
      htmlContent.slice(0, headEndTagIndex),
      linkTag2,
      linkTag3,
      scriptTag1,
      scriptTag2,
      customLinkTag,
      customScriptTag,
      scriptTagCustom,
      html2CanvasScript,
      htmlContent.slice(headEndTagIndex),
    ].join("");

    return modifiedHtml;
  } else {
    console.warn("Unable to find opening style tag in HTML content");
    return htmlContent; // Return unmodified content if the style tag is not found
  }
}

function getUploadedImageUrlFromSingedUrl(signedUrl) {
  if (signedUrl.includes("dodao-prod-public-assets")) {
    return signedUrl
      ?.replace(
        "https://dodao-prod-public-assets.s3.amazonaws.com",
        "https://d31h13bdjwgzxs.cloudfront.net"
      )
      ?.replace(
        "https://dodao-prod-public-assets.s3.us-east-1.amazonaws.com",
        "https://d31h13bdjwgzxs.cloudfront.net"
      )
      ?.split("?")[0];
  } else {
    return signedUrl?.split("?")[0];
  }
}
