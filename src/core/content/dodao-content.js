let blob;

export async function takeInputsFromUser(callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");
  if (!spaceId || !apiKey) {
    showLoginScreen(callbackFunction);
  } else {
    await showDemoSelection(spaceId, callbackFunction);
  }
}
export async function getBlob(fileName, callbackFunction) {
  // Implement logic to create a new file entry
  try {
    console.log("Creating blob:", fileName);
    //we get the blob from the callback function
    blob = callbackFunction(fileName);
    const file = new File([blob], fileName, { type: "text/html" });
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, "_blank");
    console.log("Blob accessed successfully.");
  } catch (error) {
    console.error(error);
  }
}

function showLoginScreen(callbackFunction) {
  // Create the modal element
  const loginElement = createNewModalElement(
    "Enter your API key",
    "api-key-input"
  );
  // Create the input element for Space ID
  const spaceIdInput = document.createElement("input");
  spaceIdInput.setAttribute("type", "text");
  spaceIdInput.placeholder = "Enter your Space ID";
  spaceIdInput.className = "space-id-input";
  loginElement.appendChild(spaceIdInput); // Append the Space ID input
  // Create and append the message element for API key
  const messageElementAPI = document.createElement("p");
  messageElementAPI.textContent =
    "Please enter your API key from the space settings page:";
  loginElement.appendChild(messageElementAPI); // Append the message for API key

  // Get the API key input element
  const apiKeyInput = loginElement.querySelector(".api-key-input");

  // Create the submit button
  const submitButton = createButton("Submit", "submit-button", async () => {
    // Store API key and Space ID in localStorage
    localStorage.setItem("apiKey", apiKeyInput.value);
    localStorage.setItem("spaceId", spaceIdInput.value);

    // Proceed to show the demo selection
    await showDemoSelection(spaceIdInput.value, callbackFunction);
  });

  // Append the submit button to the modal element
  loginElement.appendChild(submitButton);
}

async function showDemoSelection(spaceId, callbackFunction) {
  const demos = await fetchDemos(spaceId);
  displayDemos(demos.clickableDemos, callbackFunction);
}

async function fetchDemos(spaceId) {
  const response = await fetch(
    `http://localhost:3000/api/clickable-demos?spaceId=${spaceId}`
  );
  if (!response.ok) {
    console.error("Failed to fetch demos:", response.statusText);
    return [];
  }
  return response.json();
}

function displayDemos(demos, callbackFunction) {
  const selectedDemoId = localStorage.getItem("selectedDemoId");
  if (!selectedDemoId) {
    // Create the full screen modal if no demo is selected
    const demoModalContent = createNewModalElement();
    const container = createContainer();

    // Message above the list of demos
    const demoListMessage = document.createElement("p");
    demoListMessage.textContent = "Or Select a Demo from the List Below:";
    demoListMessage.style.color = "#FFF"; // Set text color
    demoListMessage.style.marginBottom = "10px"; // Space below the message

    const demoList = document.createElement("div");
    demoList.id = "demo-list";
    demoList.style.width = "100%";
    demos.forEach((demo) => {
      const demoItem = createButton(demo.title, "demo-item", () =>
        selectDemo(demo,callbackFunction)
      );
      demoList.appendChild(demoItem);
    });

    // Message above the "Create Demo" button
    const createDemoMessage = document.createElement("p");
    createDemoMessage.textContent = "Create a New Demo:";
    createDemoMessage.style.color = "#FFF"; // Set text color
    createDemoMessage.style.marginTop = "20px"; // Space above the message
    createDemoMessage.style.marginBottom = "10px"; // Space below the message
    container.appendChild(createDemoMessage);

    // Add "Create Demo" button
    const createDemoButton = createButton(
      "Create a Demo",
      "create-demo-button",
      () => {
        showCreateDemoScreen(callbackFunction);
      }
    );
    container.appendChild(createDemoButton);
    container.appendChild(demoListMessage);
    container.appendChild(demoList);
    demoModalContent.appendChild(container);

    // Create a new bottom bar
    const bottomBar = createBottomBar();
    bottomBar.id = "bottom-bar"; // Assign an ID for easy reference and removal
    bottomBar.style.display = "block";
    // Create and append style for the bottom bar
    const styleElement = createBottomBarStyle();
    document.head.appendChild(styleElement); // Append the styles to the head for global effect

    // Create the logout button
    const logoutButton = createButton("Logout", "logout-button", async () => {
      localStorage.clear(); // Clear all local storage items
      removeModalElement(); // Close the modal
      await showLoginScreen(); // Navigate back to the login screen
    });
    logoutButton.style.margin = "10px"; // Pushes all other elements to the right
    logoutButton.style.width = "10%";
    logoutButton.style.position = "relative";
    logoutButton.style.left = "0px";
    bottomBar.appendChild(logoutButton);
    const dodao_full_screen_modal_wrapper = document.querySelector(
      "#dodao-full-screen-modal-wrapper"
    );
    const fullScreenModal =
      dodao_full_screen_modal_wrapper.shadowRoot.querySelector(
        ".full-screen-modal"
      );
    fullScreenModal.appendChild(bottomBar);
  } else {
    let selectedDemo = demos.find((demo) => demo.id === selectedDemoId);

    // Remove any existing bottom bar first
    let fullScreenModalWrapper = document.querySelector(
      "#dodao-full-screen-modal-wrapper"
    );
    if (fullScreenModalWrapper) {
      fullScreenModalWrapper.remove();
    }
    const existingBottomBar = document.getElementById("bottom-bar");
    if (existingBottomBar) {
      existingBottomBar.remove();
    }

    // Create a new bottom bar
    const bottomBar = createBottomBar();
    bottomBar.id = "bottom-bar"; // Assign an ID for easy reference and removal

    // Create and append style for the bottom bar
    const styleElement = createBottomBarStyle();
    document.head.appendChild(styleElement); // Append the styles to the head for global effect

    // Create the logout button
    const logoutButton = createButton("Logout", "logout-button", async () => {
      localStorage.clear(); // Clear all local storage items
      removeModalElement(); // Close the modal
      await showLoginScreen(); // Navigate back to the login screen
    });
    logoutButton.style.margin = "10px"; // Pushes all other elements to the right
    logoutButton.style.width = "10%";
    // Create and append the title of the selected demo
    const demoTitle = document.createElement("span");
    demoTitle.id = "demo-name";
    demoTitle.textContent = selectedDemo
      ? `Selected Demo: ${selectedDemo.title}`
      : "No demo selected";

    // Create buttons
    const saveButton = createButton(
      `Save to ${selectedDemo.title}`,
      "save-button", () => {
        showSaveFileScreen(selectedDemo, callbackFunction)
      }
    );
    const chooseAnotherButton = createButton(
      "Choose Another Demo",
      "choose-another-button",
      () => {
        localStorage.removeItem("selectedDemoId");
        displayDemos(demos, callbackFunction);
      }
    );

    // Container for buttons to align them to the right
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px"; // Space between buttons

    // Append buttons to their container
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(chooseAnotherButton);

    // Append logout button, title, and button container to the bottom bar
    bottomBar.appendChild(logoutButton); // This places the logout button at the extreme left
    bottomBar.appendChild(demoTitle);
    bottomBar.appendChild(buttonContainer);

    // Append the bottom bar to the body
    document.body.appendChild(bottomBar);
  }
}

function showCreateDemoScreen(callbackFunction) {
  // Create the modal element
  const createDemoElement = createNewModalElement(
    "Enter demo details",
    "demo-name-input",
    "text" // Type of input for the name
  );

  // Create and append the name input field
  const nameInput = createDemoElement.querySelector(".demo-name-input");
  nameInput.placeholder = "Enter demo name";
  nameInput.style.width = "90%";
  nameInput.style.padding = "10px";
  nameInput.style.marginBottom = "10px";

  // Create and append the description input field
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.placeholder = "Enter demo description";
  descriptionInput.classList.add("demo-description-input");
  descriptionInput.style.width = "90%";
  descriptionInput.style.padding = "10px"; // Double the padding to increase height
  descriptionInput.style.marginBottom = "10px";
  createDemoElement.appendChild(descriptionInput);

  // Create and append the submit button
  const submitButton = createButton(
    "Create Demo",
    "create-demo-button",
    async () => {
      const name = nameInput.value;
      const description = descriptionInput.value;
      if (name && description) {
        await createDemo(name, description);
        removeModalElement(); // Remove the modal after submission
        await showDemoSelection(localStorage.getItem("spaceId"),callbackFunction); // Return to demo selection screen
      } else {
        alert("Please enter both name and description for the demo.");
      }
    }
  );
  submitButton.style.width = "calc(50% - 10px)"; // Adjust for margin
  submitButton.style.padding = "12px 20px";

  // Create and append the cancel button
  const cancelButton = createButton("Cancel", "cancel-button", async () => {
    removeModalElement(); // Close the modal
    await showDemoSelection(localStorage.getItem("spaceId"),callbackFunction); // Return to demo selection screen
  });
  cancelButton.style.width = "calc(50% - 10px)"; // Adjust for margin
  cancelButton.style.padding = "12px 20px";

  // Style buttons for proper alignment
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.width = "90%"; // Align with inputs
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  createDemoElement.appendChild(buttonContainer);
}

async function createDemo(demoName, demoDescription) {
  // Implement logic to create the new demo
  // This example assumes an API endpoint for creating a demo
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");
  const submitButton = document.querySelector(".create-demo-button");
  try {
    console.log(JSON.stringify({ demoName, demoDescription }));
    const response = await fetch(
      `http://localhost:3000/api/${spaceId}/actions/clickable-demos/create-with-api`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demoName, demoDescription }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create demo: " + response.statusText);
    }
    console.log("Demo created successfully.");
  } catch (error) {
    console.error(error);
    console.log(213124124);
  }
}

async function selectDemo(demo,callbackFunction) {
  // Store the selected demo ID in localStorage
  localStorage.setItem("selectedDemoId", demo.id);
  removeModalElement();
  await showDemoSelection(localStorage.getItem("spaceId"),callbackFunction);
  // document.querySelector("#demo-list").style.display = "none";
}

function createNewModalElement(
  placeholder = "",
  inputClass = "",
  inputType = "text"
) {
  // Check if a modal already exists and remove it
  let fullScreenModalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (fullScreenModalWrapper) {
    fullScreenModalWrapper.remove();
  }

  // Create a new full-screen modal wrapper
  fullScreenModalWrapper = document.createElement("div");
  fullScreenModalWrapper.id = "dodao-full-screen-modal-wrapper";
  document.body.appendChild(fullScreenModalWrapper);

  // Attach shadow DOM for style encapsulation
  const shadowRoot = fullScreenModalWrapper.attachShadow({ mode: "open" });
  shadowRoot.appendChild(createModalStyle());

  // Create a modal container within the shadow root
  const modalElement = document.createElement("div");
  modalElement.id = "modal-wrapper";
  modalElement.classList.add("full-screen-modal");

  // Create content element inside the modal container
  const contentElement = document.createElement("div");
  contentElement.classList.add("modal-content");

  // Optionally add an input element if required
  if (inputClass) {
    const inputElement = document.createElement("input");
    inputElement.type = inputType;
    inputElement.placeholder = placeholder;
    inputElement.classList.add(inputClass);
    contentElement.appendChild(inputElement);
  }

  // Append content to the modal container
  modalElement.appendChild(contentElement);

  // Append the modal container to the shadow root
  shadowRoot.appendChild(modalElement);

  return contentElement;
}

function createModalStyle() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
  .full-screen-modal, .full-screen-modal * {
      h2:revert;
      font-family: Arial, sans-serif;
    }
 .full-screen-modal {
    position: fixed;
    top: 0;
    left: 0;
    font-size: 24px;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
    background-color: rgba(18, 18, 18, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
    color: #ffffff;
}

.modal-content {
    width: 90%;
    max-width:800px;
    overflow:hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #252525;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
    max-height: 80%;
}
#demo-list {
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 10px; 
    width: 100%; 
    margin-bottom: 10px; 
}
input, button {
    padding: 14px 22px;
    margin-top: 12px;
    font-size: 24px;
    width: 100%;
    box-sizing: border-box;
}

input {
    background-color: #fff;
    color: #333;
    border: 2px solid #ccc;
    border-radius: 4px;
}

input:focus {
    border-color: #007bff;
    outline: none;
}

button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover, button:focus {
    background-color: #0056b3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    outline: none;
}

    `;
  return styleElement;
}
function createBottomBarStyle() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    #bottom-bar, #bottom-bar * {
      font-family: Arial, sans-serif;
    }
    #bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #343a40; 
        color: #ffffff;
        display: flex;
        justify-content: space-around; 
        align-items: center; 
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
        z-index: 2147483647; 
        padding: 0 20px; 
    }
    #bottom-bar #demo-name {
        all:revert;
        flex-grow: 1;
        font-size:24px;
        font-weight: bold; 
        line-height: 70px; 
    }
    #bottom-bar div{
        margin-right:24px
    }
        
    #bottom-bar button {
        all:revert;
        padding: 10px 20px;
        font-size: 24px;
        border: none;
        background-color: #007bff; 
        color: #fff;
        cursor: pointer;
        border-radius: 5px; 
        transition: background-color 0.3s;
    }
    #bottom-bar button.save-button {
        all:revert;
        padding: 10px 20px;
        font-size: 24px;
        border: none;
        background-color: #32CD32;
        color: #fff;
        cursor: pointer;
        border-radius: 5px; 
        transition: background-color 0.3s;
    }
     #bottom-bar button.save-button:hover {
     background-color: #228B22;
     }
    #bottom-bar button:hover {
        background-color: #0056b3; 
    }
            
    `;
  return styleElement;
}
function createContainer() {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.width = "100%";
  return container;
}

function createBottomBar() {
  const bottomBar = document.createElement("div");
  bottomBar.style.position = "fixed";
  bottomBar.style.bottom = "0";
  bottomBar.style.left = "0";
  bottomBar.style.width = "100%";
  bottomBar.style.backgroundColor = "#333";
  bottomBar.style.color = "#fff";
  bottomBar.style.display = "flex";
  bottomBar.style.justifyContent = "space-around";
  bottomBar.style.padding = "10px";
  return bottomBar;
}

function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  button.onclick = onClick;
  return button;
}


function removeModalElement() {
  const modalWrapper = document.querySelector("#modal-wrapper");
  if (modalWrapper) {
    modalWrapper.remove();
  }
}

function showSaveFileScreen(demo,callbackFunction) {
  // Create the modal element
  const uploadModalElement = createNewModalElement(
    "Save File",
    "file-name-input",
    "text" // Type of input for the file name
  );

  // Create and append the file name input field
  const nameInput = uploadModalElement.querySelector(".file-name-input");
  nameInput.placeholder = "Enter file name";
  nameInput.style.width = "90%";
  nameInput.style.marginBottom = "10px";

  // Create and append the existing files section
  const existingFilesContainer = document.createElement("div");
  existingFilesContainer.id = "existing-files";
  existingFilesContainer.style.marginBottom = "20px";
  existingFilesContainer.style.width = "90%";
  uploadModalElement.appendChild(existingFilesContainer);

  // Load existing files and display them
  // loadExistingFiles(existingFilesContainer);

  // Create and append the submit button
  const submitButton = createButton(
    "Save File",
    "save-file-button",
    async () => {
     const simulationOptions= {
        fileName : nameInput.value,
        objectId : demo.title.replace(/\s+/g, '-')
     }
     let fullScreenModalWrapper = document.querySelector(
      "#dodao-full-screen-modal-wrapper"
     );
     let bottomBar = document.querySelector(
      "#bottom-bar"
     );
     if (fullScreenModalWrapper && bottomBar) {
       fullScreenModalWrapper.remove();
       bottomBar.remove();
    }
      await callbackFunction(simulationOptions);

    }
    //   const fileName = nameInput.value;
    //   if (fileName) {
    //     // Convert blob to file using user input for file name
    //     const file = new File([blob], fileName, { type: "text/html" });
    //     console.log(file);
    //     removeModalElement(); // Remove the modal after submission

    //     // Create a FileReader to read the file's contents
    //     const reader = new FileReader();

    //     // Promise to handle reading the file asynchronously
    //     const readPromise = new Promise((resolve, reject) => {
    //       // When the read is complete, resolve the promise with the file content
    //       reader.onload = () => resolve(reader.result);
    //       // If there's an error, reject the promise
    //       reader.onerror = () => reject(reader.error);
    //     });

    //     // Start reading the file as text
    //     reader.readAsText(file);

    //     try {
    //       // Wait for the file to be read and store the result in htmlContent
    //       const htmlContent = await readPromise;
    //       // // Manipulate the HTML
    //       const modifiedHtml = injectScriptLinkTags(htmlContent);

    //       const blob = new Blob([modifiedHtml], { type: "text/html" });
    //       const editedFile = new File([blob], file.name, {
    //         type: "text/html",
    //       });

    //       // window.open(fileUrl, "_blank");
    //       try {
    //         const input = {
    //           imageType: `ClickableDemos/${localStorage.getItem(
    //             "selectedDemoId"
    //           )}`,
    //           contentType: file.type,
    //           objectId: "the_test_academy",
    //           name: file.name,
    //         };

    //         console.log(input);
    //         const spaceId = localStorage.getItem("spaceId");

    //         const data = await fetch(
    //           "http://localhost:3000/api/s3-signed-urls",
    //           {
    //             method: "POST",
    //             headers: {
    //               "X-API-KEY": localStorage.getItem("apiKey"),
    //               "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ spaceId, input }),
    //           }
    //         )
    //           .then((response) => {
    //             if (!response.ok) {
    //               throw new Error("Network response was not ok");
    //             }
    //             return response.json(); // Parse JSON from the response
    //           })
    //           .then((data) => {
    //             console.log(data.url);
    //             return data; // Access the 'url' property from the JSON object
    //           })
    //           .catch((error) => {
    //             console.error(
    //               "There has been a problem with your fetch operation:",
    //               error
    //             );
    //           });

    //         const signedUrl = data.url;
    //         console.log(signedUrl);
    //         await fetch(signedUrl, {
    //           method: "PUT", // Specify the method
    //           headers: {
    //             "Content-Type": file.type, // Set the content type header
    //           },
    //           body: editedFile, // Set the body of the request to the file you are uploading
    //         });
    //         const fileUrl = getUploadedImageUrlFromSingedUrl(signedUrl);

    //         console.log(fileUrl);
    //       } catch (error) {
    //         console.error("Error uploading file:", error);
    //         alert("Failed to upload the file.");
    //       }
    //       console.log("HTML Content of the file:", htmlContent);
    //     } catch (error) {
    //       console.error("Error reading file:", error);
    //       alert("Failed to read the file.");
    //     }

    //     // Optionally refresh the file list or perform other actions
    //     await refreshFileList();
    //   } else {
    //     alert("Please enter a file name.");
    //   }
    // }
  );
  submitButton.style.width = "calc(50% - 10px)";
  submitButton.style.padding = "12px 20px";

  // Create and append the cancel button
  const cancelButton = createButton("Cancel", "cancel-button", async () => {
    removeModalElement(); // Close the modal
    await showDemoSelection(localStorage.getItem("spaceId"),callbackFunction);
  });
  cancelButton.style.width = "calc(50% - 10px)";
  cancelButton.style.padding = "12px 20px";

  // Style buttons for proper alignment
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.width = "90%";
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  uploadModalElement.appendChild(buttonContainer);
}

async function loadExistingFiles(container) {
  // Implement logic to fetch and display existing files
  try {
    const response = await fetch("https://example.com/api/files");
    if (!response.ok) {
      throw new Error("Failed to load existing files: " + response.statusText);
    }

    const files = await response.json();
    container.innerHTML = ""; // Clear existing content

    files.forEach((file) => {
      const fileItem = document.createElement("div");
      fileItem.textContent = file.name; // Display file name
      fileItem.style.marginBottom = "5px";
      container.appendChild(fileItem);
    });
  } catch (error) {
    console.error(error);
  }
}

async function refreshFileList() {
  // Optionally refresh the file list
  // Implement logic to fetch and display the updated file list
  const existingFilesContainer = document.getElementById("existing-files");
  if (existingFilesContainer) {
    // await loadExistingFiles(existingFilesContainer);
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
