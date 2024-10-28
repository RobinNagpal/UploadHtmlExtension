import html2canvas from "html2canvas";

export async function getDodaoScreenshotBlobUrl(content) {
  // Remove the loader from the content before creating the iframe for screenshot
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const loaderBackground = doc.querySelector(".loader-background");
  
  if (loaderBackground) {
    loaderBackground.remove();
  }

  const modifiedContent = doc.documentElement.innerHTML;

  const iframe = createIframeWithContent(modifiedContent);
  document.body.appendChild(iframe);
  const dodaoScreenshotBlobUrl = await new Promise((resolve, reject) => {
    iframe.onload = async () => {
      const iframeDocument = iframe.contentDocument;
      const canvas = await html2canvas(iframeDocument.body, {
        width: 1920,
        height: 1080,
        windowWidth: 1920,
        windowHeight: 1080,
        useCORS: true,
        allowTaint: true,
      });

      const canvasBlob = await canvasToBlob(canvas);

      const dodaoScreenshotBlobUrl = URL.createObjectURL(canvasBlob);
      // remove the iframe after screesnhot is taken
      document.body.removeChild(iframe);
      
      resolve(dodaoScreenshotBlobUrl);
    };
  });

  return dodaoScreenshotBlobUrl;
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
