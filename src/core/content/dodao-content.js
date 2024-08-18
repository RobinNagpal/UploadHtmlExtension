export async function takeInputsFromUser(callbackFunction) {
  const spaceId = localStorage.getItem("spaceId");
  if (!spaceId) {
    showLoginScreen(callbackFunction);
  } else {
    await showDemoSelection(spaceId, callbackFunction);
  }
}

function showLoginScreen(callbackFunction) {
  const loginElement = createNewModalElement('Enter your API key', 'api-key-input');
  const inputElement = loginElement.querySelector(".api-key-input");
  const submitButton = createButton('Submit', 'submit-button', async () => {
    localStorage.setItem("spaceId", inputElement.value);
    removeModalElement();
    await showDemoSelection(inputElement.value, callbackFunction);
  });
  loginElement.appendChild(submitButton);
}

async function showDemoSelection(spaceId, callbackFunction) {
  const demos = await fetchDemos(spaceId);
  displayDemos(demos.clickableDemos, callbackFunction);
}

async function fetchDemos(spaceId) {
  const response = await fetch(`https://tidbitshub.org/api/clickable-demos?spaceId=uniswap-eth-1`);
  if (!response.ok) {
    console.error('Failed to fetch demos:', response.statusText);
    return [];
  }
  return response.json();
}

function displayDemos(demos, callbackFunction) {
  const demoModalContent = createNewModalElement(); // Ensure this function creates a fresh modal each time

  // Container for all demo-related content
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.width = "100%";

  // Retrieve and display the selected demo first, if one exists
  const selectedDemoId = localStorage.getItem("selectedDemoId");
  let selectedDemo;
  if (selectedDemoId) {
    selectedDemo = demos.find(demo => demo.id === selectedDemoId);
    if (selectedDemo) {
      const selectedDemoDisplay = document.createElement("div");
      selectedDemoDisplay.textContent = `Selected Demo: ${selectedDemo.title}`;
      selectedDemoDisplay.style.marginBottom = "20px"; // Provides visual spacing

      const changeButton = createButton("Change Demo", 'change-button', () => {
        selectDemo(selectedDemo, callbackFunction, demoModalContent); // Reuse the selectDemo function to handle this
      });

      const uploadButton = createButton("Upload", 'upload-button', () => uploadFilePrompt(selectedDemo, callbackFunction));

      selectedDemoDisplay.appendChild(changeButton);
      selectedDemoDisplay.appendChild(uploadButton);
      container.appendChild(selectedDemoDisplay);

      // Horizontal line and label to separate selected demo from the list
      const separator = document.createElement("hr");
      container.appendChild(separator);
      const orLabel = document.createElement("div");
      orLabel.textContent = "Or Select from the below";
      orLabel.style.color = "#ffffff"; // Ensure the text is white
      orLabel.style.margin = "10px 0"; // Top and bottom margin
      container.appendChild(orLabel);
    }
  }

  // List all demos
  const demoList = document.createElement("div");
  demoList.id = "demo-list";
  demoList.style.width = "100%";

  demos.forEach(demo => {
    if (!selectedDemo || demo.id !== selectedDemo.id) { // Exclude already selected demo from the list
      const demoItem = createButton(demo.title, 'demo-item', () => selectDemo(demo, callbackFunction, demoModalContent));
      demoList.appendChild(demoItem);
    }
  });

  container.appendChild(demoList);
  demoModalContent.appendChild(container);
}

function selectDemo(demo) {
  const existingSelection = document.querySelector("#selected-demo");
  if (existingSelection) {
    existingSelection.remove();
  }
  const demoSelection = document.createElement("div");
  demoSelection.id = "selected-demo";
  demoSelection.textContent = `Selected Demo: ${demo.name}`;
  const changeButton = document.createElement("button");
  changeButton.textContent = "Change Demo";
  changeButton.onclick = () => {
    document.querySelector("#demo-list").style.display = "block";
    // demoSelection.remove();
  };
  const uploadButton = document.createElement("button");
  uploadButton.textContent = "Upload";
  uploadButton.onclick = () => uploadFilePrompt(demo);
  demoSelection.appendChild(changeButton);
  demoSelection.appendChild(uploadButton);
  document.body.appendChild(demoSelection);
  // document.querySelector("#demo-list").style.display = "none";
}

function createNewModalElement(placeholder = '', inputClass = '', inputType = 'text') {
  // Check if a modal already exists and remove it
  const existingModal = document.getElementById('modal-wrapper');
  if (existingModal) {
    existingModal.remove();
  }

  // Create a new modal element
  const modalElement = document.createElement('div');
  modalElement.id = 'modal-wrapper';
  modalElement.classList.add('full-screen-modal');

  // Create shadow DOM to encapsulate styles
  const shadowRoot = modalElement.attachShadow({mode: "open"});
  shadowRoot.appendChild(createModalStyle());

  // Create the content element inside the modal
  const contentElement = document.createElement("div");
  contentElement.classList.add('modal-content');
  contentElement.classList.add('full-screen-modal');

  // Optionally add an input element if required
  if (inputClass) {
    const inputElement = document.createElement("input");
    inputElement.type = inputType;
    inputElement.placeholder = placeholder;
    inputElement.classList.add(inputClass);
    contentElement.appendChild(inputElement);
  }

  // Append content element to shadow DOM
  shadowRoot.appendChild(contentElement);

  // Append modal element to the document body
  document.body.appendChild(modalElement);

  return contentElement;
}

function createModalStyle() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
        .full-screen-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2147483647;
            background-color: #121212;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
        }
        .modal-content {
            width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto; // In case of many demos
            max-height: 90%; // Prevents the modal from occupying full height
        }
        input, button {
            padding: 10px;
            margin: 5px;
            font-size: 16px;
            width: 300px;
            background-color: #ffffff;
            border: none;
        }
        input {
            color: #000000;
        }
        button {
            background-color: #007bff;
            color: white;
            cursor: pointer;
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
  const modalWrapper = document.querySelector('#modal-wrapper');
  if (modalWrapper) {
    modalWrapper.remove();
  }
}
