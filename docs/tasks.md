# Current Work
Note: The work needs to be done in small PR which will be reviewed and merged quickly.  Create a new branch from 
`sherwani/addedScreens` and then once done with the first task, create a PR and then wait for the merge. Repeat this 
process for each task.

The PR will be created against the `sherwani/addedScreens` branch, and not the `main` branch. Because we want all
the changes in the `sherwani/addedScreens` branch to look good before merging it to the `main` branch.

# PRs

### PR 1
- [ ] Add a method in `dodao-upload.js` called `extensionClicked`. This method should check if the spaceId and
apiKey are present in the local storage. If they are not present, then it should show a message to the content script.
`{method: dodaoContent.captureApiKey}`
- [ ] In `dodao-content.js`, add a message listener `browser.runtime.onMessage.addListener(message => {` just like we have 
in `content.js` and `content-bootstrap.js`. This should be present at the top of the file. This listener should listen for
the message `dodaoContent.captureApiKey` and then call another method `showSpaceIdAndApiScreen`. 
- [ ] In `dodao-content.js`, in method `showSpaceIdAndApiScreen` add logic to show the input fields for spaceId and apiKey
and once the user enters the values, send a message to the background script to save the values in the local storage.
`{method: dodaoBackground.saveSpaceIdAndApiKey, spaceId: spaceId, apiKey: apiKey}`

### PR 2

 
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts
