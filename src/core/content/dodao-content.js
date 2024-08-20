export async function takeInputsFromUser(callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  if (!spaceId) {
    showLoginScreen(callbackFunction);
  } else {
    await showDemoSelection(spaceId, callbackFunction);
  }
}
function showLoginScreen(callbackFunction) {
  // Create the modal element
  const loginElement = createNewModalElement(
    "Enter your API key",
    "api-key-input"
  );

  // Create and append the message element
  const messageElement = document.createElement("p");
  messageElement.textContent =
    "Please enter your API from space settings page:";
  loginElement.insertBefore(
    messageElement,
    loginElement.querySelector(".api-key-input")
  );

  // Get the input element and create the submit button
  const inputElement = loginElement.querySelector(".api-key-input");
  const submitButton = createButton("Submit", "submit-button", async () => {
    localStorage.setItem("spaceId", inputElement.value);
    await showDemoSelection(inputElement.value, callbackFunction);
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
    `https://tidbitshub.org/api/clickable-demos?spaceId=${spaceId}`
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
        selectDemo(demo, callbackFunction, demoModalContent)
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
      showCreateDemoScreen
    );
    container.appendChild(createDemoButton);
    container.appendChild(demoListMessage);
    container.appendChild(demoList);
    demoModalContent.appendChild(container);
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

    // Create and append the title of the selected demo
    const demoTitle = document.createElement("span");
    demoTitle.id = "demo-name";
    demoTitle.textContent = selectedDemo
      ? `Selected Demo: ${selectedDemo.title}`
      : "No demo selected";

    // Create buttons
    const uploadButton = createButton(
      `Upload to ${selectedDemo.title}`,
      "upload-button",
      () => console.log("Upload clicked")
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
    buttonContainer.appendChild(uploadButton);
    buttonContainer.appendChild(chooseAnotherButton);

    // Append title and button container to the bottom bar
    bottomBar.appendChild(demoTitle);
    bottomBar.appendChild(buttonContainer);

    // Append the bottom bar to the body
    document.body.appendChild(bottomBar);
  }
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

function showCreateDemoScreen() {
  // Create the modal element
  const createDemoElement = createNewModalElement(
    "Enter demo details",
    "demo-name-input",
    "text" // Type of input for the name
  );

  // Create and append the name input field
  const nameInput = createDemoElement.querySelector(".demo-name-input");
  nameInput.placeholder = "Enter demo name";

  // Create and append the description input field
  const descriptionInput = document.createElement("textarea");
  descriptionInput.placeholder = "Enter demo description";
  descriptionInput.classList.add("demo-description-input");
  descriptionInput.style.margin = "10px";
  descriptionInput.style.width = "90%";
  createDemoElement.appendChild(descriptionInput);

  // Create and append the submit button
  const submitButton = createButton(
    "Create Demo",
    "create-demo-button",
    async () => {
      const name = nameInput.value;
      const description = descriptionInput.value;

      if (name && description) {
        // Handle the creation of the new demo
        await createDemo(name, description);
        removeModalElement(); // Remove the modal after submission
        // Optionally refresh the demo list or perform other actions
        await refreshDemoList();
      } else {
        alert("Please enter both name and description for the demo.");
      }
    }
  );
  submitButton.style.width = "50%";
  createDemoElement.appendChild(submitButton);

  // Create and append the cancel button
  const cancelButton = createButton("Cancel", "cancel-button", async () => {
    removeModalElement(); // Close the modal
    await showDemoSelection(localStorage.getItem("spaceId")); // Return to demo selection screen
  });
  createDemoElement.appendChild(cancelButton);

  // Style buttons for proper alignment
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.width = "100%";
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  createDemoElement.appendChild(buttonContainer);
}

async function createDemo(name, description) {
  // Implement logic to create the new demo
  // This example assumes an API endpoint for creating a demo
  try {
    const response = await fetch("https://example.com/api/demos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      throw new Error("Failed to create demo: " + response.statusText);
    }
    console.log("Demo created successfully.");
  } catch (error) {
    console.error(error);
  }
}

async function refreshDemoList() {
  // Optionally refresh the demo list
  const spaceId = localStorage.getItem("spaceId");
  if (spaceId) {
    const demos = await fetchDemos(spaceId);
    displayDemos(demos, showDemoSelection);
  }
}

async function selectDemo(demo) {
  // Store the selected demo ID in localStorage
  localStorage.setItem("selectedDemoId", demo.id);
  removeModalElement();
  await showDemoSelection(localStorage.getItem("spaceId"));
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
    console.log(123234);
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
    #bottom-bar button:hover {
        background-color: #0056b3; 
    }
            
    `;
  return styleElement;
}

function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  button.onclick = onClick;
  return button;
}

function uploadFilePrompt(demo, callbackFunction) {
  const fileName = prompt("Enter the name of the file to upload:");
  if (fileName) {
    console.log("Uploading", fileName, "to demo", demo.name);
    callbackFunction();
  }
}

function removeModalElement() {
  const modalWrapper = document.querySelector("#modal-wrapper");
  if (modalWrapper) {
    modalWrapper.remove();
  }
}
