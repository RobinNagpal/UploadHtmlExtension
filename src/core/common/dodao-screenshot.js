import * as ui from "./../../ui/content/content-ui.js";

export async function getDodaoScreenshotBlobUrl(options) {
  ui.setVisible(false);

  const screenshotBlobURI = await browser.runtime.sendMessage({
    method: "tabs.getScreenshot",
    width: window.innerWidth,
    height: window.innerHeight,
    innerHeight: globalThis.innerHeight,
  });
  ui.setVisible(true);
  const embeddedImage = new Uint8Array(
    await (await fetch(screenshotBlobURI)).arrayBuffer()
  );
  const blob = new Blob([embeddedImage], { type: "image/png" });
  return URL.createObjectURL(blob);
}

function createIframeWithContent(htmlContent) {
  const iframe = document.createElement("iframe");
  iframe.style.width = "1920px";
  iframe.style.height = "1080px";
  iframe.style.border = "none";
  iframe.srcdoc = htmlContent;
  iframe.style.position = "absolute";// added these postions so the symmetry of the page doesn't get disturbed by iframe
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  return iframe;
}

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

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/png");
  });
}
