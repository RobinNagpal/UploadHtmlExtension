import { v4 as uuidv4 } from "uuid";
export function init() {}

browser.runtime.onMessage.addListener(async (message) => {
  if (message.method === "dodaoContent.captureApiKey") {
    showSaveApiKeyAndSpaceIdScreen(message);
  }
  if (message.method === "dodaoContent.selectClickableDemo") {
    showsaveClickableDemoScreen(message);
  }
  if (message.method === "dodaoContent.renderBottomBar") {
    if (message.data.screenCaptured) {
      hideLoader();
      showSuccessNotification("Screen captured successfully");
    }
    else if(message.data.errorCaptured) {
      hideLoader();
      showErrorNotification(message.data.errorCaptured);
    }
    setupBottomBarWithDemo(
      message.data.spaceId,
      message.data.apiKey,
      message.data.selectedClickableDemo,
      message.data.selectedTidbitCollection
    );
  }
  if (message.method === "dodaoContent.captureScreenHtml") {
    if (message.data.error) {
      showErrorNotification(message.data.error);
    } else {
      captureScreenHtml(
        message.data.spaceId,
        message.data.apiKey,
        message.data.selectedClickableDemo,
        message.data.selectedTidbitCollection
      );
    }
  }
  if(message.method === "dodaoContent.showLoader") {
    showLoader();
  }
});

function showSaveApiKeyAndSpaceIdScreen(message) {
  if (message.data) {
    showLoginScreen();
    showErrorNotification(message.data.error);
  } else {
    showLoginScreen();
  }
}

async function showsaveClickableDemoScreen(message) {
  if (message.data.error) {
    showErrorNotification(message.data.error);
    setTimeout(async () => {
      await showCollectionSelection(
        message.data.spaceId,
        message.data.apiKey,
        message.data.selectedTidbitCollection,
        message.data.selectedClickableDemo
      );
    }, 2000); // This delays the function call by 2 seconds
  } else {
    await showCollectionSelection(
      message.data.spaceId,
      message.data.apiKey,
      message.data.selectedTidbitCollection,
      message.data.selectedClickableDemo
    );
  }
}

function showLoginScreen(message) {
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
    messageText: message,
    inputs,
    submitButtonText: "Submit",
    submitButtonClass: "submit-button",
    submitButtonHandler: async () => {
      const spaceIdInput = inputs[0].element;
      const apiKeyInput = inputs[1].element;

      browser.runtime.sendMessage({
        method: "dodaoBackground.saveSpaceIdAndApiKey",
        data: {
          spaceId: spaceIdInput.value,
          apiKey: apiKeyInput.value,
        },
      });
    },
  });
}

async function showCollectionSelection(
  spaceId,
  apiKey,
  selectedTidbitCollection,
  selectedClickableDemo
) {
  const collections = await fetchCollections(spaceId);
  if (collections) {
    displayCollections(
      spaceId,
      apiKey,
      collections,
      selectedTidbitCollection,
      selectedClickableDemo
    );
  } else {
    displayErrorModal(
      "Failed to fetch collections. Please try again.",
      async () => {
        removeModalElement();
        await showCollectionSelection(
          spaceId,
          apiKey,
          selectedTidbitCollection,
          selectedClickableDemo
        );
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

function displayCollections(
  spaceId,
  apiKey,
  collections,
  selectedTidbitCollection,
  selectedClickableDemo
) {
  if (!selectedTidbitCollection) {
    showCollectionList(
      spaceId,
      apiKey,
      collections,
      selectedTidbitCollection,
      selectedClickableDemo
    );
  } else {
    const selectedCollection = collections.find(
      (collection) => collection.id === selectedTidbitCollection.id
    );

    if (!selectedCollection) {
      console.error("Selected collection not found or does not exist");
      showCollectionList(spaceId, apiKey, collections);
    } else {
      removeModalElement();
      const demosInCollection = getDemosFromCollection(selectedCollection);
      displayDemos(
        spaceId,
        apiKey,
        selectedCollection,
        demosInCollection,
        selectedClickableDemo
      );
    }
  }
}

function showCollectionList(
  spaceId,
  apiKey,
  collections,
  selectedTidbitCollection,
  selectedClickableDemo
) {
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
        () =>
          selectCollection(spaceId, apiKey, collection, selectedClickableDemo)
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
    () =>
      showCreateCollectionScreen(
        spaceId,
        apiKey,
        selectedTidbitCollection,
        selectedClickableDemo
      )
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
      (item) => item.type === "ClickableDemo" && item.demo && !item.demo.archive
    )
    .map((item) => item.demo);
}

function showCreateCollectionScreen(
  spaceId,
  apiKey,
  selectedTidbitCollection,
  selectedClickableDemo
) {
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
        await createCollection(name, description, spaceId, apiKey);
        removeModalElement();
        await showCollectionSelection(
          spaceId,
          apiKey,
          selectedTidbitCollection,
          selectedClickableDemo
        );
      } else {
        alert("Please enter both name and description for the collection.");
      }
    },
    cancelButtonHandler: async () => {
      removeModalElement();
      await showCollectionSelection(
        spaceId,
        apiKey,
        selectedTidbitCollection,
        selectedClickableDemo
      );
    },
  });
}

async function createCollection(name, description, spaceId, apiKey) {
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

async function selectCollection(
  spaceId,
  apiKey,
  collection,
  selectedClickableDemo
) {
  removeModalElement();
  await showCollectionSelection(
    spaceId,
    apiKey,
    collection,
    selectedClickableDemo
  );
}

function displayDemos(
  spaceId,
  apiKey,
  collection,
  demos,
  selectedClickableDemo
) {
  if (!demos) {
    displayErrorModal("Failed to fetch demos. Please try again.", async () => {
      removeModalElement();
      await showCollectionSelection(
        spaceId,
        apiKey,
        collection,
        selectedClickableDemo
      );
    });
    return;
  }
  if (!selectedClickableDemo) {
    showDemoList(spaceId, apiKey, collection, demos, selectedClickableDemo);
  } else {
    const selectedDemo = demos.find(
      (demo) => demo.demoId === selectedClickableDemo.demoId
    );
    if (!selectedDemo) {
      console.error("Selected demo not found or does not exist");
      showDemoList(spaceId, apiKey, collection, demos, selectedClickableDemo);
    }
  }
}

function showDemoList(
  spaceId,
  apiKey,
  collection,
  demos,
  selectedClickableDemo
) {
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
        selectDemo(demo, collection)
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
      showCreateDemoScreen(spaceId, apiKey, collection, selectedClickableDemo);
    }
  );

  container.appendChild(createDemoMessage);
  container.appendChild(createDemoButton);
  container.appendChild(demoListMessage);
  if (demos.length > 0) {
    container.appendChild(demoList);
  }

  demoModalContent.appendChild(container);
  setupBottomBarForDemos(spaceId, apiKey, collection, selectedClickableDemo);
}

function setupBottomBarForDemos(
  spaceId,
  apiKey,
  selectedTidbitCollection,
  selectedClickableDemo
) {
  const existingBottomBar = document.getElementById("bottom-bar");
  if (existingBottomBar) existingBottomBar.remove();

  const bottomBar = createBottomBar();
  bottomBar.id = "bottom-bar";

  const styleElement = createBottomBarStyle();
  document.head.appendChild(styleElement);

  const logoutButton = createButton("Logout", "logout-button", async () => {
    browser.runtime.sendMessage({ method: "dodaoBackground.logout" });
    removeModalElement();
    showLoginScreen();
  });
  logoutButton.style.marginLeft = "10px";
  logoutButton.style.marginRight = "10px";
  logoutButton.style.width = "10%";

  const chooseCollectionButton = createButton(
    "Choose Another Collection",
    "choose-collection-button",
    () => {
      browser.runtime.sendMessage({
        method: "dodaoBackground.changeCollection",
      });
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

function setupBottomBarWithDemo(
  spaceId,
  apiKey,
  selectedClickableDemo,
  selectedTidbitCollection
) {
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
    browser.runtime.sendMessage({ method: "dodaoBackground.logout" });
    removeModalElement();
    showLoginScreen();
  });
  logoutButton.style.marginLeft = "10px";
  logoutButton.style.marginRight = "10px";
  logoutButton.style.width = "10%";

  const demoTitle = document.createElement("span");
  demoTitle.id = selectedClickableDemo.id;
  demoTitle.classList.add("demo-name");
  demoTitle.textContent = `Selected Demo: ${selectedClickableDemo.title}`;

  const saveButton = createButton(
    `Save to ${selectedClickableDemo.title}`,
    "save-button",
    () => {
      browser.runtime.sendMessage({
        method: "dodaoBackground.captureScreenClicked",
      });
    }
  );

  const chooseAnotherButton = createButton(
    "Choose Another Demo",
    "choose-another-button",
    async () => {
      browser.runtime.sendMessage({
        method: "dodaoBackground.changeDemo",
        data: {
          selectedClickableDemo: null,
          selectedTidbitCollection: selectedTidbitCollection,
        },
      });
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

function showCreateDemoScreen(
  spaceId,
  apiKey,
  selectedTidbitCollection,
  selectedClickableDemo
) {
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
        await createDemo(
          name,
          description,
          spaceId,
          apiKey,
          selectedTidbitCollection,
          selectedClickableDemo
        );
        removeModalElement();
        await showCollectionSelection(
          spaceId,
          apiKey,
          selectedTidbitCollection,
          selectedClickableDemo
        );
      } else {
        alert("Please enter both name and description for the demo.");
      }
    },
    cancelButtonHandler: async () => {
      removeModalElement();
      await showCollectionSelection(
        spaceId,
        apiKey,
        selectedTidbitCollection,
        selectedClickableDemo
      );
    },
  });
}

async function createDemo(
  title,
  excerpt,
  spaceId,
  apiKey,
  selectedTidbitCollection,
  selectedClickableDemo
) {
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
          byteCollectionId: selectedTidbitCollection.id,
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

async function selectDemo(demo, collection) {
  browser.runtime.sendMessage({
    method: "dodaoBackground.saveSelectedClickableDemo",
    data: {
      selectedClickableDemo: demo,
      selectedTidbitCollection: collection,
    },
  });
}

function addLogoutButton() {
  const bottomBar = createBottomBar();
  bottomBar.id = "bottom-bar";

  const logoutButton = createButton("Logout", "logout-button", async () => {
    browser.runtime.sendMessage({ method: "dodaoBackground.logout" });
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

async function captureScreenHtml(spaceId, apiKey, demo, collection) {
  const demoId = demo.demoId;
  const apiUrl = `http://localhost:3000/api/${spaceId}/html-captures/${demoId}`;
  let existingFiles = [];
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
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
        ${existingFiles
          .map(
            (file) => `
          <tr>
            <td>${file.fileName}</td>
          </tr>
        `
          )
          .join("")}
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
    },
  ];

  createModalForm({
    title: "Save File",
    inputs,
    submitButtonText: "Save File",
    submitButtonClass: "save-file-button",
    submitButtonHandler: async () => {
      const nameInput = inputs[0].element;
      if (nameInput.value) {
        const fileName = nameInput.value;
        const fullScreenModalWrapper = document.querySelector(
          "#dodao-full-screen-modal-wrapper"
        );
        const bottomBar = document.querySelector("#bottom-bar");
        if (fullScreenModalWrapper) fullScreenModalWrapper.remove();
        if (bottomBar) bottomBar.remove();
        browser.runtime.sendMessage({
          method: "dodaoBackground.savePage",
          data: {
            captureHtmlScreenFileName: fileName,
          },
        });
      } else {
        alert("Please enter a file name to save the file.");
      }
    },
    cancelButtonHandler: async () => {
      browser.runtime.sendMessage({
        method: "dodaoBackground.cancelCaptureHtmlScreenClicked",
        data: {
          selectedClickableDemo: demo,
          selectedTidbitCollection: collection,
        },
      });
    },
  });
  const existingFilesContainer = document.createElement("div");
  existingFilesContainer.className = "existing-files-container";
  existingFilesContainer.innerHTML = existingFilesHtml;

  const fullScreenModalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (fullScreenModalWrapper) {
    fullScreenModalWrapper.shadowRoot
      .querySelector(".full-screen-modal")
      .appendChild(existingFilesContainer);
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
  // Create the modal element and container for the form
  const modalElement = createNewModalElement(title);
  const formContainer = modalElement;

  // If messageText is provided, create and append the message element
  if (messageText) {
    const messageElement = createMessageElement(messageText, {
      marginBottom: "10px",
      color: "#FFF", // Customize the text color if needed
    });
    formContainer.appendChild(messageElement);
  }

  // Create and append each input element based on the provided configuration
  inputs.forEach((inputConfig) => {
    const inputElement = createInputElement(
      inputConfig.type || "text",
      inputConfig.placeholder || "",
      inputConfig.className || "",
      inputConfig.styles || {}
    );
    formContainer.appendChild(inputElement);
    // Store the input element reference inside the inputConfig object
    inputConfig.element = inputElement;
  });

  // Create the submit button
  const submitButton = createButton(
    submitButtonText,
    submitButtonClass,
    submitButtonHandler
  );
  submitButton.style.width = cancelButtonHandler ? "calc(50% - 10px)" : "100%";
  submitButton.style.padding = "12px 20px";

  let buttons = [submitButton];

  // If a cancel button is required, create and append it
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

  // Create a container for buttons and append it to the form
  const buttonContainer = createButtonContainer(buttons);
  formContainer.appendChild(buttonContainer);

  // Return the input elements for external handling
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
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999; /* High z-index for visibility */
          background-color: #f44336; /* Red background for errors */
          color: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
      }

      .notification.show {
          opacity: 1;
      }
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
    #bottom-bar .demo-name {
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

function showNotification(message, type = "error") {
  const backgroundColor = type === "success" ? "#4CAF50" : "#f44336"; // Green for success, red for error

  // Create a style element to hold the CSS
  const style = document.createElement("style");
  style.innerHTML = `
      .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999; /* High z-index for visibility */
          background-color: ${backgroundColor}; /* Dynamic background color */
          color: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
      }

      .notification.show {
          opacity: 1;
      }
  `;

  // Append the style element to the head
  document.head.appendChild(style);

  // Create the notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;

  // Append to body
  const modalWrapper = document.querySelector(
    "#dodao-full-screen-modal-wrapper"
  );
  if (modalWrapper) {
    modalWrapper.shadowRoot
      .querySelector(".full-screen-modal")
      .appendChild(notification);
  } else {
    document.body.appendChild(notification);
  }

  // Add the show class to fade in the notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    // Remove from DOM after the transition
    if (modalWrapper) {
      setTimeout(() => {
        modalWrapper.shadowRoot
          .querySelector(".full-screen-modal")
          .removeChild(notification);
      }, 500);
    } else {
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }
  }, 5000); // Duration to display the notification
}

function showErrorNotification(errorMessage) {
  showNotification(errorMessage, "error");
}

function showSuccessNotification(successMessage) {
  showNotification(successMessage, "success");
}

function showLoader() {
  // Create the loader element
  const loader = document.createElement("div");
  loader.className = "loader";

  // Create the loader background
  const loaderBackground = document.createElement("div");
  loaderBackground.className = "loader-background";

  // Append the loader to the loader background
  loaderBackground.appendChild(loader);

  // Append the loader background to the body
  document.body.appendChild(loaderBackground);

  // Add styles for the loader and background
  const style = document.createElement("style");
  style.textContent = `
    .loader-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999; /* High z-index for visibility */
    }
    .loader {
      border: 8px solid #f3f3f3; /* Light grey */
      border-top: 8px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }
    .loader-text {
      margin-top: 20px;
      color: #fff;
      font-size: 18px;
      font-family: Arial, sans-serif;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Add loader text
  const loaderText = document.createElement("div");
  loaderText.className = "loader-text";
  loaderText.textContent = "Uploading...";

  // Append loader text to loader background
  loaderBackground.appendChild(loaderText);
}

function hideLoader() {
  const loaderBackground = document.querySelector(".loader-background");
  if (loaderBackground) {
    loaderBackground.remove();
  }
}