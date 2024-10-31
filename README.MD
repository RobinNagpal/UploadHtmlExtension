# SingleFile MV3

This is the new version of
[SingleFile](https://github.com/gildas-lormeau/SingleFile) compatible with the
Manifest V3.

## Manual install

Download the zip file
(https://github.com/gildas-lormeau/SingleFile-MV3/archive/master.zip) of the project
and install it manually by unzipping it somewhere on your disk and following
these instructions:

- Chrome:
  https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked
- Microsoft Edge:
  https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading


# How does the extension work.

Extensions have two types of scripts: background scripts and content scripts.
- Background scripts run in the background of the browser and can be used to
  listen to events and perform actions that are common to all tabs.
- Content scripts run in the context of a tab and can be used to interact with
  the DOM of the page.

Here in our extension, we store the spaceId, apiKey, selectedCollection, and selectedDemo. Storing and retrieving these 
values is done using the chrome.storage API. The background script does the storing and retrieving of these values.


Messaging between the background script and the content script is done using the chrome.runtime API. 

# dodao-upload.js and dodao-content.js
All the content on the DOM is created in dodao-content.js. This is the content script. When any action is done on the
UI, we listen to the action, and pass a message to the background script. 

For example

# Loading of the extension
When the extension icon is clicked, the background checks if the spaceId and apiKey exists, if it exists, it send a message
to the content script(dodao-content.js), to draw the bottom bar.

If the spaceId and apiKey does not exist, it sends a message to the content script to draw the modal to capture the spaceId
and apiKey.

The UI captures it and then sends a message to the background script to store the spaceId and apiKey.


# When we enter file name of capture
when user enters the "Html capture" file name, we call the background script and pass the filename. 

Background script has the logic to see what needs to be done, and what UI needs to be shown next. In this case, the 
background will initiate download of the file by calling `business.saveTabs` method and passing dodao specific config.


# Showing of extension
The extension is shown when the user clicks on the extension icon. The background script listens to the click event. Its
present in `ui-button.js`

```javascript
browser.action.onClicked.addListener(async tab => {
	await business.extensionIconClicked(tab);
});
```

Earlier(base code of extension), used to call saveTab, which used to download the file. Now we show the bottom bar
or the spaceId and apiKey modal. `business.extensionIconClicked(tab)` this function was written by us.

# Important files
- `dodao-upload.js` - This is the background script. This is the script that listens to the messages from the content script
  and does the necessary actions. This has the logic to decide what should be done next, i.e. flow of the extension.
- `dodao-content.js` - This is the content script. This is the script that interacts with the DOM of the page. This is the
  script that creates the UI on the page. i.e. the bottom bar or the modals, or the success and error messages.
- `background.js` - This has the logic for post handler of download of the file. This in our flow is called from `content.js` (existing logic of the extension)
  ```javascript
  const pageData = await processPage(options);
  if (pageData) {
    await download.downloadPage(pageData, options);
  }
  ```
  We just modify a couple of lines in download.js. This file then does the post handling of the download and send a message "downloads.download"
  
  Here is some of the custom logic
  ```javascript
    if (options.saveWithTidbitsHub) {
        // we capture screenshot using options.content as it contains whole page content for the screesnhot
        message.dodaoScreenshotBlobUrl = await getDodaoScreenshotBlobUrl(options.content);
    }
  ```
- `download.js` - This is the file that handles the download of the file. This is the file that listens to the message "downloads.download"
   We added some custom code to this file which looks like 
   ```javascript
    if (message.saveWithTidbitsHub) {
      // adding the scripts to the content
      message.pageData.content=injectScriptLinkTags(message.pageData.content)
    } 
    ```
    This is the code that injects the scripts to the content. Like the dodao tooltip, selector, css, and tippy scripts

    ```javascript
     else if (message.saveWithTidbitsHub) {
        const blob = await (await fetch(blobURI)).blob();
        const screenshotBlob = new Blob([await (await fetch(message.dodaoScreenshotBlobUrl)).blob()], { type: "image/png" });
        await uploadFileToDodao(message.captureHtmlScreenFileName, blob, screenshotBlob);
	 }
    ```
    This code send the message to dodao api to upload the html capture.
