export async function takeInputsFromUser(callbackFunction) {
  chrome.storage.local.clear(function(obj){
    console.log("cleared");
  });
  const spaceId = localStorage.getItem("spaceId");
  if (!spaceId) {
    showLoginScreen(callbackFunction);
  } else {
    await showDemoSelection(spaceId, callbackFunction);
  }
}

function showLoginScreen(callbackFunction) {
  const loginElement = createModalElement('Enter your API key', 'api-key-input');
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
  const demoModal = createModalElement();
  const selectedDemoId = localStorage.getItem("selectedDemoId");

  if (selectedDemoId) {
    const selectedDemo = demos.find(demo => demo.id === selectedDemoId);
    const selectedDemoDisplay = document.createElement("div");
    selectedDemoDisplay.textContent = `Selected Demo: ${selectedDemo.title}`;
    const changeButton = createButton("Change Demo", 'change-button', () => {
      demoModal.querySelector("#demo-list").style.display = "block";
      selectedDemoDisplay.remove();
    });
    const uploadButton = createButton("Upload", 'upload-button', () => uploadFilePrompt(selectedDemo, callbackFunction));
    selectedDemoDisplay.appendChild(changeButton);
    selectedDemoDisplay.appendChild(uploadButton);
    demoModal.appendChild(selectedDemoDisplay);
  }

  const demoList = document.createElement("div");
  demoList.id = "demo-list";
  demoList.style.display = selectedDemoId ? "none" : "block";
  demos.forEach(demo => {
    const demoItem = createButton(demo.title, 'demo-item', () => selectDemo(demo, callbackFunction, demoModal));
    demoList.appendChild(demoItem);
  });
  demoModal.appendChild(demoList);
}

function createModalElement(placeholder = '', inputClass = '', inputType = 'text') {
  const modalElement = document.createElement('div');
  modalElement.id = 'modal-wrapper';
  modalElement.classList.add('full-screen-modal');
  const shadowRoot = modalElement.attachShadow({mode: "open"});
  shadowRoot.appendChild(createModalStyle());
  const contentElement = document.createElement("div");
  contentElement.classList.add('modal-content'); // Added class for styling content specifically
  if (inputClass) {
    const inputElement = document.createElement("input");
    inputElement.type = inputType;
    inputElement.placeholder = placeholder;
    inputElement.classList.add(inputClass);
    contentElement.appendChild(inputElement);
  }
  shadowRoot.appendChild(contentElement);
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
