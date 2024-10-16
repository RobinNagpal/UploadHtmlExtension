# Start 

When you click on the extension icon (also known as the action button), one of two things can happen:
1) Popup is displayed: If you have defined a default_popup in your manifest.json, the specified HTML file is displayed as a popup UI.
2) Event is fired: If no default_popup is defined, the chrome.action.onClicked event is triggered, and you can handle it in your background script.

### ui-button.js

`browser.action.onClicked.addListener` is defined in the `src/ui/bg/ui-button.js` file. This is the file that is executed when the 
extension icon is clicked. 

```javascript
browser.action.onClicked.addListener(async tab => {
  const highlightedTabs = await queryTabs({currentWindow: true, highlighted: true});
  if (highlightedTabs.length <= 1) {
    toggleSaveTab(tab);
  } else {
    business.saveTabs(highlightedTabs);
  }
  // ... other code
});
```






