import html2canvas from "html2canvas";

export async function getDodaoScreenshotBlobUrl(content){
  const iframe = createIframeWithContent(content);
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

      const canvasBlob = await canvasToBlob(
        canvas
      );

      const dodaoScreenshotBlobUrl = URL.createObjectURL(canvasBlob);
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
