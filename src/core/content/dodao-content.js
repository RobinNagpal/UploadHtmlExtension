import { v4 as uuidv4 } from "uuid";

export async function takeInputsFromUser(callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");

  if (!spaceId || !apiKey) {
    showLoginScreen(callbackFunction);
  } else {
    await showCollectionSelection(spaceId, callbackFunction);
  }
}

function showLoginScreen(callbackFunction) {
  const inputs = [
    {
      className: "space-id-input",
      placeholder: "Enter your Space ID",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
    {
      className: "api-key-input",
      placeholder: "Enter your API key from the space settings page:",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
  ];

  createModalForm({
    title: "Login",
    inputs,
    submitButtonText: "Submit",
    submitButtonClass: "submit-button",
    submitButtonHandler: async () => {
      const spaceIdInput = inputs[0].element;
      const apiKeyInput = inputs[1].element;
      localStorage.setItem("spaceId", spaceIdInput.value);
      localStorage.setItem("apiKey", apiKeyInput.value);
      await showCollectionSelection(spaceIdInput.value, callbackFunction);
    },
  });
}

async function showCollectionSelection(spaceId, callbackFunction) {
  const collections = await fetchCollections(spaceId);
  if (collections) {
    displayCollections(collections, callbackFunction);
  } else {
    displayErrorModal(
      "Failed to fetch collections. Please try again.",
      async () => {
        removeModalElement();
        await showCollectionSelection(spaceId, callbackFunction);
      }
    );
  }
}

async function fetchCollections(spaceId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/byte-collection/byte-collections?spaceId=${spaceId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.byteCollections || [];
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return null;
  }
}

function displayCollections(collections, callbackFunction) {
  const selectedCollectionId = localStorage.getItem("selectedCollectionId");

  if (!selectedCollectionId) {
    showCollectionList(collections, callbackFunction);
  } else {
    const selectedCollection = collections.find(
      (collection) => collection.id === selectedCollectionId
    );

    if (!selectedCollection) {
      console.error("Selected collection not found or does not exist");
      localStorage.removeItem("selectedCollectionId");
      showCollectionList(collections, callbackFunction);
    } else {
      removeModalElement();
      const demosInCollection = getDemosFromCollection(selectedCollection);
      displayDemos(selectedCollection, demosInCollection, callbackFunction);
    }
  }
}

function showCollectionList(collections, callbackFunction) {
  const collectionModalContent = createNewModalElement();
  const container = createContainer();

  const collectionListMessage = createMessageElement(
    collections.length > 0
      ? "Select a Collection from the List Below:"
      : "No collections found. Create a new collection.",
    { marginBottom: "10px", color: "#FFF" }
  );

  const collectionList = document.createElement("div");
  collectionList.id = "list";
  collectionList.style.width = "100%";

  if (collections.length > 0) {
    collections.forEach((collection) => {
      const collectionItem = createButton(
        collection.name,
        "collection-item",
        () => selectCollection(collection, callbackFunction)
      );
      collectionList.appendChild(collectionItem);
    });
  }

  const createCollectionMessage = createMessageElement(
    "Create a New Collection:",
    {
      marginTop: "20px",
      marginBottom: "10px",
      color: "#FFF",
    }
  );
  const createCollectionButton = createButton(
    "Create a Collection",
    "create-collection-button",
    () => showCreateCollectionScreen(callbackFunction)
  );

  container.appendChild(createCollectionMessage);
  container.appendChild(createCollectionButton);
  container.appendChild(collectionListMessage);
  if (collections.length > 0) container.appendChild(collectionList);

  collectionModalContent.appendChild(container);
  addLogoutButton();
}

function getDemosFromCollection(collection) {
  return collection.items
    .filter(
      (item) =>
        item.type === "ClickableDemo" && item.demo && !item.demo.archive
    )
    .map((item) => item.demo);
}

function showCreateCollectionScreen(callbackFunction) {
  const inputs = [
    {
      className: "collection-name-input",
      placeholder: "Enter collection name",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
    {
      className: "collection-description-input",
      placeholder: "Enter collection description",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
  ];

  createModalForm({
    title: "Enter collection details",
    inputs,
    submitButtonText: "Create Collection",
    submitButtonClass: "create-collection-button",
    submitButtonHandler: async () => {
      const nameInput = inputs[0].element;
      const descriptionInput = inputs[1].element;
      const name = nameInput.value;
      const description = descriptionInput.value;
      if (name && description) {
        await createCollection(name, description);
        removeModalElement();
        await showCollectionSelection(
          localStorage.getItem("spaceId"),
          callbackFunction
        );
      } else {
        alert("Please enter both name and description for the collection.");
      }
    },
    cancelButtonHandler: async () => {
      removeModalElement();
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    },
  });
}

async function createCollection(name, description) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");

  try {
    const response = await fetch(
      `http://localhost:3000/api/${spaceId}/byte-collections`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            name,
            description,
          },
        }),
      }
    );

    if (response.ok) {
      alert("Collection Created Successfully");
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error || `HTTP error! status: ${response.status}`;
      console.error("Failed to create collection:", errorMessage);
      alert("Failed to create collection");
    }
  } catch (error) {
    console.error("Failed to create collection:", error);
    alert("Failed to create collection");
  }
}

async function selectCollection(collection, callbackFunction) {
  localStorage.setItem("selectedCollectionId", collection.id);
  removeModalElement();
  await showCollectionSelection(
    localStorage.getItem("spaceId"),
    callbackFunction
  );
}

function displayDemos(collection, demos, callbackFunction) {
  if (!demos) {
    displayErrorModal("Failed to fetch demos. Please try again.", async () => {
      removeModalElement();
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    });
    return;
  }

  const selectedDemoId = localStorage.getItem("selectedDemoId");
  if (!selectedDemoId) {
    showDemoList(collection, demos, callbackFunction);
  } else {
    const selectedDemo = demos.find((demo) => demo.demoId === selectedDemoId);
    if (!selectedDemo) {
      console.error("Selected demo not found or does not exist");
      localStorage.removeItem("selectedDemoId");
      showDemoList(collection, demos, callbackFunction);
    } else {
      setupBottomBarWithDemo(selectedDemo, callbackFunction);
    }
  }
}

function showDemoList(collection, demos, callbackFunction) {
  const demoModalContent = createNewModalElement();
  const container = createContainer();

  const demoListMessage = createMessageElement(
    demos.length > 0
      ? "Select a Demo from the List Below:"
      : "No demos found. Create a new demo.",
    { marginBottom: "10px", color: "#FFF" }
  );

  const demoList = document.createElement("div");
  demoList.id = "list";
  demoList.style.width = "100%";

  if (demos.length > 0) {
    demos.forEach((demo) => {
      const demoItem = createButton(demo.title, "demo-item", () =>
        selectDemo(demo, callbackFunction)
      );
      demoList.appendChild(demoItem);
    });
  }

  const createDemoMessage = createMessageElement("Create a New Demo:", {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#FFF",
  });

  const createDemoButton = createButton(
    "Create a Demo",
    "create-demo-button",
    () => {
      showCreateDemoScreen(callbackFunction);
    }
  );

  container.appendChild(createDemoMessage);
  container.appendChild(createDemoButton);
  container.appendChild(demoListMessage);
  if (demos.length > 0) {
    container.appendChild(demoList);
  }

  demoModalContent.appendChild(container);
  setupBottomBarForDemos(callbackFunction);
}

function setupBottomBarForDemos(callbackFunction) {
  const existingBottomBar = document.getElementById("bottom-bar");
  if (existingBottomBar) existingBottomBar.remove();

  const bottomBar = createBottomBar();
  bottomBar.id = "bottom-bar";

  const styleElement = createBottomBarStyle();
  document.head.appendChild(styleElement);

  const logoutButton = createButton("Logout", "logout-button", async () => {
    localStorage.clear();
    removeModalElement();
    showLoginScreen(callbackFunction);
  });
  logoutButton.style.marginLeft = "10px";
  logoutButton.style.marginRight = "10px";
  logoutButton.style.width = "10%";

  const chooseCollectionButton = createButton(
    "Choose Another Collection",
    "choose-collection-button",
    async () => {
      localStorage.removeItem("selectedCollectionId");
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    }
  );
  chooseCollectionButton.style.marginRight = "24px";
  chooseCollectionButton.style.width = "20%";

  bottomBar.appendChild(logoutButton);
  bottomBar.appendChild(document.createElement("span")); // Placeholder for alignment
  bottomBar.appendChild(chooseCollectionButton);

  const modalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  const fullScreenModal =
    modalWrapper.shadowRoot.querySelector(".full-screen-modal");
  fullScreenModal.appendChild(bottomBar);
}

function setupBottomBarWithDemo(selectedDemo, callbackFunction) {
  const existingModal = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (existingModal) existingModal.remove();

  const existingBottomBar = document.getElementById("bottom-bar");
  if (existingBottomBar) existingBottomBar.remove();

  const bottomBar = createBottomBar();
  bottomBar.id = "bottom-bar";

  const styleElement = createBottomBarStyle();
  document.head.appendChild(styleElement);
  const logoutButton = createButton("Logout", "logout-button", async () => {
    localStorage.clear();
    removeModalElement();
    showLoginScreen(callbackFunction);
  });
  logoutButton.style.marginLeft = "10px";
  logoutButton.style.marginRight = "10px";
  logoutButton.style.width = "10%";

  const demoTitle = document.createElement("span");
  demoTitle.id = "demo-name";
  demoTitle.textContent = `Selected Demo: ${selectedDemo.title}`;

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
    async () => {
      localStorage.removeItem("selectedDemoId");
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
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

function showCreateDemoScreen(callbackFunction) {
  const inputs = [
    {
      className: "demo-name-input",
      placeholder: "Enter demo name",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
    {
      className: "demo-description-input",
      placeholder: "Enter demo description",
      styles: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
      },
    },
  ];

  createModalForm({
    title: "Enter demo details",
    inputs,
    submitButtonText: "Create Demo",
    submitButtonClass: "create-demo-button",
    submitButtonHandler: async () => {
      const nameInput = inputs[0].element;
      const descriptionInput = inputs[1].element;
      const name = nameInput.value;
      const description = descriptionInput.value;
      if (name && description) {
        await createDemo(name, description);
        removeModalElement();
        await showCollectionSelection(
          localStorage.getItem("spaceId"),
          callbackFunction
        );
      } else {
        alert("Please enter both name and description for the demo.");
      }
    },
    cancelButtonHandler: async () => {
      removeModalElement();
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    },
  });
}

async function createDemo(title, excerpt) {
  const spaceId = localStorage.getItem("spaceId");
  const apiKey = localStorage.getItem("apiKey");
  const input = {
    title,
    excerpt,
    steps: [],
  };

  const demoId = createNewEntityId(title, spaceId);

  try {
    const response = await fetch(
      `http://localhost:3000/api/${spaceId}/clickable-demos/${demoId}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          byteCollectionId: localStorage.getItem("selectedCollectionId"),
        }),
      }
    );

    if (response.ok) {
      alert("Demo Created Successfully");
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error || `HTTP error! status: ${response.status}`;
      console.error("Failed to create demo:", errorMessage);
      alert("Failed to create demo");
    }
  } catch (error) {
    console.error("Failed to create demo:", error);
    alert("Failed to create demo");
  }
}

async function selectDemo(demo, callbackFunction) {
  localStorage.setItem("selectedDemoId", demo.demoId);
  removeModalElement();
  await showCollectionSelection(
    localStorage.getItem("spaceId"),
    callbackFunction
  );
}

function addLogoutButton() {
  const bottomBar = createBottomBar();
  bottomBar.id = "bottom-bar";
  
  const logoutButton = createButton("Logout", "logout-button", async () => {
    localStorage.clear();
    removeModalElement();
    showLoginScreen();
  });
  logoutButton.style.marginLeft = "10px";
  logoutButton.style.marginRight = "10px";
  logoutButton.style.width = "10%";
  bottomBar.appendChild(logoutButton);

  const modalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  const fullScreenModal =
    modalWrapper.shadowRoot.querySelector(".full-screen-modal");
  fullScreenModal.appendChild(bottomBar);
}

async function showSaveFileScreen(demo, callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  const demoId = demo.demoId;
  const apiKey = localStorage.getItem("apiKey");
  const apiUrl = `http://localhost:3000/api/${spaceId}/html-captures/${demoId}`;
  let existingFiles = [];
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey, 
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch existing files.");
    }
    existingFiles = await response.json();
  } catch (error) {
    console.error("Error fetching existing files:", error);
  }
  const existingFilesHtml = `
    <table class="existing-files-table">
      <thead>
        <tr>
          <th>Existing files in Demo ${demo.title}</th>
        </tr>
      </thead>
      <tbody>
        ${existingFiles.map(file => `
          <tr>
            <td>${file.fileName}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const inputs = [
    {
      className: "file-name-input",
      placeholder: "Enter file name",
      styles: {
        width: "90%",
        marginBottom: "10px",
      },
    }
  ];

  createModalForm({
    title: "Save File",
    inputs,
    submitButtonText: "Save File",
    submitButtonClass: "save-file-button",
    submitButtonHandler: async () => {
      const nameInput = inputs[0].element;
      if (nameInput.value) {
        const simulationOptions = {
          fileName: nameInput.value,
          objectId: demo.title.replace(/\s+/g, "-"),
          demoId: demo.demoId,
        };
        const fullScreenModalWrapper = document.querySelector("#dodao-full-screen-modal-wrapper");
        const bottomBar = document.querySelector("#bottom-bar");
        if (fullScreenModalWrapper) fullScreenModalWrapper.remove();
        if (bottomBar) bottomBar.remove();
        await callbackFunction(simulationOptions);
        await takeInputsFromUser(callbackFunction);
      } else {
        alert("Please enter a file name to save the file.");
      }
    },
    cancelButtonHandler: async () => {
      removeModalElement();
      await showCollectionSelection(
        localStorage.getItem("spaceId"),
        callbackFunction
      );
    },
  });
    const existingFilesContainer = document.createElement('div');
    existingFilesContainer.className = 'existing-files-container';
    existingFilesContainer.innerHTML = existingFilesHtml;

    const fullScreenModalWrapper = document.querySelector("#dodao-full-screen-modal-wrapper");
    if (fullScreenModalWrapper) {
      fullScreenModalWrapper.shadowRoot.querySelector('.full-screen-modal').appendChild(existingFilesContainer);
    }
}


/* Helper Functions */

function createModalForm({
  title,
  messageText,
  inputs,
  submitButtonText,
  submitButtonClass,
  submitButtonHandler,
  cancelButtonText = "Cancel",
  cancelButtonClass = "cancel-button",
  cancelButtonHandler,
}) {
  const modalElement = createNewModalElement(title);

  const formContainer = modalElement;

  if (messageText) {
    const messageElement = createMessageElement(messageText, {
      marginBottom: "10px",
      color: "#FFF",
    });
    formContainer.appendChild(messageElement);
  }

  inputs.forEach((inputConfig) => {
    const inputElement = createInputElement(
      inputConfig.type || "text",
      inputConfig.placeholder || "",
      inputConfig.className || "",
      inputConfig.styles || {}
    );
    formContainer.appendChild(inputElement);
    inputConfig.element = inputElement;
  });

  const submitButton = createButton(
    submitButtonText,
    submitButtonClass,
    submitButtonHandler
  );
  submitButton.style.width = cancelButtonHandler ? "calc(50% - 10px)" : "100%";
  submitButton.style.padding = "12px 20px";

  let buttons = [submitButton];

  if (cancelButtonHandler) {
    const cancelButton = createButton(
      cancelButtonText,
      cancelButtonClass,
      cancelButtonHandler
    );
    cancelButton.style.width = "calc(50% - 10px)";
    cancelButton.style.padding = "12px 20px";
    buttons.push(cancelButton);
  }

  const buttonContainer = createButtonContainer(buttons);
  formContainer.appendChild(buttonContainer);

  return inputs;
}

function createInputElement(type, placeholder, className, styles = {}) {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (className) {
    input.classList.add(className);
  }
  Object.assign(input.style, styles);
  return input;
}

function createButtonContainer(buttons, styles = {}) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.width = "90%";
  Object.assign(container.style, styles);
  buttons.forEach((button) => container.appendChild(button));
  return container;
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
    const inputElement = createInputElement(inputType, placeholder, inputClass);
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
      font-family: Arial, sans-serif;
    }
    .full-screen-modal {
      position: fixed;
      top: 0;
      left: 0;
      font-size: 24px;
      flex-direction: column;
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
    .existing-files-container {
        width: 60%;
        margin-top: 50px;
        padding: 10px;
        background-color: #333;
        border-radius: 8px;
        max-height: 200px;
        overflow-y: auto;
      }

    .existing-files-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 16px;
      color: #fff;
    }

    .existing-files-table th {
      background-color: #444;
      color: #fff;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #555;
      font-size: 18px;
    }

    .existing-files-table td {
      padding: 10px;
      border-bottom: 1px solid #555;
    }
    .existing-files-table tr:nth-child(odd) {
        background-color: #3a3a3a;
      }

      .existing-files-table tr:nth-child(even) {
        background-color: #2c2c2c;
      }

      /* Hover effect on rows */
      .existing-files-table tr:hover {
        background-color: #505050;
        transition: background-color 0.3s ease;
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
    #list {
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
      justify-content: space-between; 
      align-items: center; 
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
      z-index: 2147483647; 
      padding: 0 20px; 
    }
    #bottom-bar #demo-name {
      flex-grow: 1;
      font-size:24px;
      font-weight: bold; 
      line-height: 70px; 
    }
    #bottom-bar button {
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
      background-color: #32CD32;
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
  bottomBar.style.justifyContent = "space-between";
  bottomBar.style.padding = "10px";
  return bottomBar;
}

function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  if (className) button.classList.add(className);
  button.onclick = onClick;
  return button;
}

function removeModalElement() {
  const modalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (modalWrapper) {
    modalWrapper.remove();
  }
}

function displayErrorModal(message, retryHandler) {
  const errorModal = createNewModalElement();
  const container = createContainer();

  const errorMessage = createMessageElement(message, {
    marginBottom: "10px",
    color: "#FFF",
  });

  const retryButton = createButton("Retry", "retry-button", retryHandler);

  container.appendChild(errorMessage);
  container.appendChild(retryButton);
  errorModal.appendChild(container);
}

function createMessageElement(text, styles = {}) {
  const messageElement = document.createElement("p");
  messageElement.textContent = text;
  Object.assign(messageElement.style, styles);
  return messageElement;
}

function slugify(string) {
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

function createNewEntityId(entityName, spaceId) {
  const firstSegment = spaceId.split("-")[0];
  const normalizedSpaceId = firstSegment.substring(
    0,
    Math.min(8, firstSegment.length)
  );
  return `${slugify(entityName)}-${normalizedSpaceId}-${uuidv4()
    .toString()
    .substring(0, 4)}`;
}
