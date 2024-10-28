export const DODAO_API_BASE_URL = "https://tidbitshub.org";
// export const DODAO_API_BASE_URL = "http://localhost:3000";
export const CLIKABLE_FILES_HOST_URL = "https://dodao-prod-public-assets.s3.amazonaws.com";
// export const CLIKABLE_FILES_HOST_URL = "https://dodao-dev-public-assets.s3.amazonaws.com";

export function injectScriptLinkTags(htmlContent) {
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

export function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function removeLoader(content) {
  // Remove the loader from the content
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const loaderBackground = doc.querySelector(".loader-background");
  
  if (loaderBackground) {
    loaderBackground.remove();
  }

  const modifiedContent = doc.documentElement.innerHTML;
  
  return modifiedContent
}

function findInsertionIndex(htmlContent) {
  const styleTagRegex = /<style>/i;
  const match = styleTagRegex.exec(htmlContent);
  return match ? match.index : undefined;
}

function getScriptLinkTags() {
  return [
    `<link rel="stylesheet" href="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/dependencies/tippy.js@6/animations/shift-toward.css" />`,
    `<link rel="stylesheet" href="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/dependencies/tippy.js@6/themes/material.css" />`,
    `<script src="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/dependencies/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>`,
    `<script src="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/dependencies/tippy.js@6.3.7/dist/tippy-bundle.umd.min.js"></script>`,
    `<script src="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/dependencies/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>`,
    `<link rel="stylesheet" href="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/clickableDemoTooltipStyles.css" />`,
    `<script src="${CLIKABLE_FILES_HOST_URL}/clickable-demos-prod-files/clickableDemoTooltipScript.js"></script>`,
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


