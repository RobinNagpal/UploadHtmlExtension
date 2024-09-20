export async function takeInputsFromUser(callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");
  if (!spaceId || !apiKey) {
    showLoginScreen(callbackFunction);
  } else {
    await showDemoSelection(spaceId, callbackFunction);
  }
}
function showLoginScreen(callbackFunction) {
  const loginElement = createNewModalElement(
    "Enter your API key",
    "api-key-input"
  );

  const spaceIdInput = document.createElement("input");
  spaceIdInput.setAttribute("type", "text");
  spaceIdInput.placeholder = "Enter your Space ID";
  spaceIdInput.className = "space-id-input";
  loginElement.appendChild(spaceIdInput);

  const messageElementAPI = document.createElement("p");
  messageElementAPI.textContent =
    "Please enter your API key from the space settings page:";
  loginElement.appendChild(messageElementAPI);

  const apiKeyInput = loginElement.querySelector(".api-key-input");

  const submitButton = createButton("Submit", "submit-button", async () => {
    localStorage.setItem("apiKey", apiKeyInput.value);
    localStorage.setItem("spaceId", spaceIdInput.value);
    await showDemoSelection(spaceIdInput.value, callbackFunction);
  });

  loginElement.appendChild(submitButton);
}

async function showDemoSelection(spaceId, callbackFunction) {
  const demos = await fetchDemos(spaceId);
  displayDemos(demos.clickableDemos, callbackFunction);
}

async function fetchDemos(spaceId) {
  const response = await fetch(
    `http://localhost:3000/api/clickable-demos?spaceId=${spaceId}`
  )
    .then((response) => response.json())
    .catch(() => []);
  return response;
}

function displayDemos(demos, callbackFunction) {
  if (!demos) {
    const errorModal = createNewModalElement();
    const container = createContainer();

    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Failed to fetch demos. Please try again.";
    errorMessage.style.color = "#FFF";
    errorMessage.style.marginBottom = "10px";

    const retryButton = createButton("Retry", "retry-button", async () => {
      removeModalElement();
      await showDemoSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    });

    container.appendChild(errorMessage);
    container.appendChild(retryButton);
    errorModal.appendChild(container);
    return;
  } else {
    const selectedDemoId = localStorage.getItem("selectedDemoId");
    if (!selectedDemoId) {
      const demoModalContent = createNewModalElement();
      const container = createContainer();

      const demoListMessage = document.createElement("p");
      const demoList = document.createElement("div");
      if (demos.length > 0) {
        demoListMessage.textContent = "Or Select a Demo from the List Below:";
        demoListMessage.style.color = "#FFF";
        demoListMessage.style.marginBottom = "10px";

        demoList.id = "demo-list";
        demoList.style.width = "100%";
        demos.forEach((demo) => {
          const demoItem = createButton(demo.title, "demo-item", () =>
            selectDemo(demo, callbackFunction)
          );
          demoList.appendChild(demoItem);
        });
      } else {
        demoListMessage.textContent = "No demos found.Create a new demo";
        demoListMessage.style.color = "#FFF";
        demoListMessage.style.marginBottom = "10px";
      }
      const createDemoMessage = document.createElement("p");
      createDemoMessage.textContent = "Create a New Demo:";
      createDemoMessage.style.color = "#FFF";
      createDemoMessage.style.marginTop = "20px";
      createDemoMessage.style.marginBottom = "10px";
      container.appendChild(createDemoMessage);

      const createDemoButton = createButton(
        "Create a Demo",
        "create-demo-button",
        () => {
          showCreateDemoScreen(callbackFunction);
        }
      );
      container.appendChild(createDemoButton);
      container.appendChild(demoListMessage);
      if (demos.length > 0) {
        container.appendChild(demoList);
      }
      demoModalContent.appendChild(container);

      const bottomBar = createBottomBar();
      bottomBar.id = "bottom-bar";
      bottomBar.style.display = "block";
      const styleElement = createBottomBarStyle();
      document.head.appendChild(styleElement);
      const logoutButton = createButton("Logout", "logout-button", async () => {
        localStorage.clear();
        removeModalElement();
        await showLoginScreen();
      });
      logoutButton.style.margin = "10px";
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
      const selectedDemo = demos.find((demo) => demo.id === selectedDemoId);
      if (!selectedDemo) {
        console.error("Selected demo not found or not exist");
        localStorage.removeItem("selectedDemoId");
      } else {
        const fullScreenModalWrapper = document.querySelector(
          "#dodao-full-screen-modal-wrapper"
        );
        if (fullScreenModalWrapper) {
          fullScreenModalWrapper.remove();
        }
        const existingBottomBar = document.getElementById("bottom-bar");
        if (existingBottomBar) {
          existingBottomBar.remove();
        }
        const bottomBar = createBottomBar();
        bottomBar.id = "bottom-bar";
        const styleElement = createBottomBarStyle();
        document.head.appendChild(styleElement);

        const logoutButton = createButton(
          "Logout",
          "logout-button",
          async () => {
            localStorage.clear();
            removeModalElement();
            await showLoginScreen();
          }
        );
        logoutButton.style.margin = "10px";
        logoutButton.style.width = "10%";
        const demoTitle = document.createElement("span");
        demoTitle.id = "demo-name";
        demoTitle.textContent = selectedDemo
          ? `Selected Demo: ${selectedDemo.title}`
          : "No demo selected";
        const saveButton = createButton(
          `Save to ${selectedDemo.title}`,
          "save-button",
          () => {
            showSaveFileScreen(selectedDemo, callbackFunction);
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
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(chooseAnotherButton);

        bottomBar.appendChild(logoutButton);
        bottomBar.appendChild(demoTitle);
        bottomBar.appendChild(buttonContainer);

        document.body.appendChild(bottomBar);
      }
    }
  }
}

function showCreateDemoScreen(callbackFunction) {
  const createDemoElement = createNewModalElement(
    "Enter demo details",
    "demo-name-input",
    "text"
  );

  const nameInput = createDemoElement.querySelector(".demo-name-input");
  nameInput.placeholder = "Enter demo name";
  nameInput.style.width = "90%";
  nameInput.style.padding = "10px";
  nameInput.style.marginBottom = "10px";

  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.placeholder = "Enter demo description";
  descriptionInput.classList.add("demo-description-input");
  descriptionInput.style.width = "90%";
  descriptionInput.style.padding = "10px";
  descriptionInput.style.marginBottom = "10px";
  createDemoElement.appendChild(descriptionInput);

  const submitButton = createButton(
    "Create Demo",
    "create-demo-button",
    async () => {
      const name = nameInput.value;
      const description = descriptionInput.value;
      if (name && description) {
        await createDemo(name, description);
        removeModalElement();
        await showDemoSelection(
          localStorage.getItem("spaceId"),
          callbackFunction
        );
      } else {
        alert("Please enter both name and description for the demo.");
      }
    }
  );
  submitButton.style.width = "calc(50% - 10px)";
  submitButton.style.padding = "12px 20px";

  const cancelButton = createButton("Cancel", "cancel-button", async () => {
    removeModalElement();
    await showDemoSelection(localStorage.getItem("spaceId"), callbackFunction);
  });
  cancelButton.style.width = "calc(50% - 10px)";
  cancelButton.style.padding = "12px 20px";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.width = "90%";
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  createDemoElement.appendChild(buttonContainer);
}

async function createDemo(demoName, demoDescription) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");

  console.log(JSON.stringify({ demoName, demoDescription }));
  await fetch(
    `http://localhost:3000/api/${spaceId}/actions/clickable-demos/create-with-api`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ demoName, demoDescription }),
    }
  )
    .then(() => {
      alert("Demo Created Successfully");
    })
    .catch(() => {
      alert("Failed to create Demo");
    });
}

async function selectDemo(demo, callbackFunction) {
  localStorage.setItem("selectedDemoId", demo.id);
  removeModalElement();
  await showDemoSelection(localStorage.getItem("spaceId"), callbackFunction);
}

function createNewModalElement(
  placeholder = "",
  inputClass = "",
  inputType = "text"
) {
  const existingWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (existingWrapper) {
    existingWrapper.remove();
  }
  const fullScreenModalWrapper = document.createElement("div");
  fullScreenModalWrapper.id = "dodao-full-screen-modal-wrapper";
  document.body.appendChild(fullScreenModalWrapper);
  const shadowRoot = fullScreenModalWrapper.attachShadow({ mode: "open" });
  shadowRoot.appendChild(createModalStyle());

  const modalElement = document.createElement("div");
  modalElement.id = "modal-wrapper";
  modalElement.classList.add("full-screen-modal");

  const contentElement = document.createElement("div");
  contentElement.classList.add("modal-content");

  if (inputClass) {
    const inputElement = document.createElement("input");
    inputElement.type = inputType;
    inputElement.placeholder = placeholder;
    inputElement.classList.add(inputClass);
    contentElement.appendChild(inputElement);
  }
  modalElement.appendChild(contentElement);
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

function showSaveFileScreen(demo, callbackFunction) {
  const uploadModalElement = createNewModalElement(
    "Save File",
    "file-name-input",
    "text"
  );
  const nameInput = uploadModalElement.querySelector(".file-name-input");
  nameInput.placeholder = "Enter file name";
  nameInput.style.width = "90%";
  nameInput.style.marginBottom = "10px";

  const existingFilesContainer = document.createElement("div");
  existingFilesContainer.id = "existing-files";
  existingFilesContainer.style.marginBottom = "20px";
  existingFilesContainer.style.width = "90%";
  uploadModalElement.appendChild(existingFilesContainer);

  const submitButton = createButton(
    "Save File",
    "save-file-button",
    async () => {
      if (nameInput.value) {
        const simulationOptions = {
          fileName: nameInput.value,
          objectId: demo.title.replace(/\s+/g, "-"),
        };
        const fullScreenModalWrapper = document.querySelector(
          "#dodao-full-screen-modal-wrapper"
        );
        const bottomBar = document.querySelector("#bottom-bar");
        if (fullScreenModalWrapper && bottomBar) {
          fullScreenModalWrapper.remove();
          bottomBar.remove();
        }
        await callbackFunction(simulationOptions);
        await takeInputsFromUser(callbackFunction);
      } else {
        alert("Please enter a file name to save the file.");
      }
    }
  );
  submitButton.style.width = "calc(50% - 10px)";
  submitButton.style.padding = "12px 20px";
  const cancelButton = createButton("Cancel", "cancel-button", async () => {
    removeModalElement();
    await showDemoSelection(localStorage.getItem("spaceId"), callbackFunction);
  });
  cancelButton.style.width = "calc(50% - 10px)";
  cancelButton.style.padding = "12px 20px";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.width = "90%";
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  uploadModalElement.appendChild(buttonContainer);
}
