### Content Scripts:
- Interact with the web page's DOM.
- Read or modify content on the page.
- Inject additional scripts or styles into the page.
- Listen for events on the page.

### Background Scripts:
- Handle events that are not specific to any web page.
- Manage global state or data.
- Communicate with servers or perform network requests.
- Listen for and respond to messages from content scripts or popup scripts.
- Manage browser actions like opening tabs or changing the browser UI.



# Architecture
- Since at the starting  ui-button.js is executed, an in that `saveTabs` is called. Probably we should add the logic
to show api key, or selection of the clickable demo here. 
- Logic
  - Check if api key and space id is present in the local storage
    - If not present storage, show the api key and space id input fields
    - Send message `{ method: "content.dodaoInputApiKey" }`
    - This should show the input screen for space id and api key
    - After use enters the api key and space id, it should send a message to the background script `{ method: "dodao.setApiKey", apiKey: "api-key", spaceId: "space-id" }`
    - Then the background script should save the api key and space id in the local storage
  - Then the background script should send a message to the content script `{ method: "content.dodaoSelectClickableDemo" }`
    - If not present in local storage, show the clickable demo selection screen
    - Send message `{ method: "content.dodaoSelectClickableDemo" }`
    - After user selects the clickable demo, send a message to the background script `{ method: "dodao.setClickableDemo", clickableDemo: "clickable-demo-id", tidbitCollectionId: "tidbit-collection-id" }`
    - Then the background script should save the clickable demo and tidbit collection id in the local storage
  -  

