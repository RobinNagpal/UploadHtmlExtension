export async function uploadFileToDodao(simulationOptions, blob, callbackFunction) {
  console.log("Uploading file to DoDAO", simulationOptions, blob);

      const fileName = simulationOptions.fileName;
      if (fileName) {
        // Convert blob to file using user input for file name
        const file = new File([blob], fileName, { type: "text/html" });
        console.log(file);

        // Create a FileReader to read the file's contents
        const reader = new FileReader();

        // Promise to handle reading the file asynchronously
        const readPromise = new Promise((resolve, reject) => {
          // When the read is complete, resolve the promise with the file content
          reader.onload = () => resolve(reader.result);
          // If there's an error, reject the promise
          reader.onerror = () => reject(reader.error);
        });

        // Start reading the file as text
        reader.readAsText(file);

        try {
          // Wait for the file to be read and store the result in htmlContent
          const htmlContent = await readPromise;
          // // Manipulate the HTML
          const modifiedHtml = injectScriptLinkTags(htmlContent);

          const blob = new Blob([modifiedHtml], { type: "text/html" });
          const editedFile = new File([blob], file.name, {
            type: "text/html",
          });

          // window.open(fileUrl, "_blank");
          try {
            const input = {
              imageType: "ClickableDemos",
              contentType: file.type,
              objectId: simulationOptions.objectId,
              name: file.name,
            };

            console.log(input);
            // Initialize the variables to hold the values
            let spaceId = undefined;
            let apiKey = undefined;

            // Fetch 'spaceId' from chrome.storage
            chrome.storage.local.get(
              ["spaceId", "apiKey"],
              async function (result) {
                if (result.spaceId && result.apiKey) {
                  spaceId = result.spaceId;
                  apiKey = result.apiKey;
                } else {
                  console.log("No data found in chrome.storage");
                }
                const data = await fetch(
                  "http://localhost:3000/api/s3-signed-urls",
                  {
                    method: "POST",
                    headers: {
                      "X-API-KEY": apiKey,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ spaceId, input }),
                  }
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse JSON from the response
                  })
                  .then((data) => {
                    console.log(data.url);
                    return data; // Access the 'url' property from the JSON object
                  })
                  .catch((error) => {
                    console.error(
                      "There has been a problem with your fetch operation:",
                      error
                    );
                  });
                const signedUrl = data.url;
                console.log(signedUrl);
                await fetch(signedUrl, {
                  method: "PUT", // Specify the method
                  headers: {
                    "Content-Type": file.type, // Set the content type header
                  },
                  body: editedFile, // Set the body of the request to the file you are uploading
                });
                const fileUrl = getUploadedImageUrlFromSingedUrl(signedUrl);

                console.log(fileUrl);
              }
            );
          } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload the file.");
          }
        } catch (error) {
          console.error("Error reading file:", error);
          alert("Failed to read the file.");
        }
      } else {
        console.error("File name is required");
        alert("Please provide a file name.");
      }
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