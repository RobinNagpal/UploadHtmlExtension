# Current Work
Note: The work needs to be done in small PR which will be reviewed and merged quickly.  Create a new branch from 
`sherwani/addedScreens` and then once done with the first task, create a PR and then wait for the merge. Repeat this 
process for each task.

The PR will be created against the `sherwani/addedScreens` branch, and not the `main` branch. Because we want all
the changes in the `sherwani/addedScreens` branch to look good before merging it to the `main` branch.

# PRs

### PR 1
- [x] In `dodaoExtensionIconClicked` in the else block, which is when we have all the data, we need to call the
`sendMethodMessage("dodaoContent.renderBottomBar")`
- [x] In `saveSelectedCollectionAndDemoId` also on successful save, we call `sendMethodMessage("dodaoContent.renderBottomBar")`
- [x] When sending this message, we send all the four pieces of data we have to the content script
- [x] We write a corresponding method in content script which uses the existing code to shw the bottom bar
- [x] When the bottom bar capture is clicked send a message to bg script to start downloading the page. This can then call the
existing code of save tab

After Rendering bottom bar there are three flows possible:
1) Logout - Send a message to the bg script to logout {method: dodaoBg.logout}
2) Capture Page - Send a message to the bg script to save the page {method: dodaoBg.captureScreenClicked}
3) Change Selected Demo - Send a message to the bg script to change the selected demo {method: dodaoBg.changeSelectedDemo}. This will 
clear the selected collection and demo from the storage and send back the message to the content script to selectClickableDemo  


### PR 2
- [ ] In the `dodaoContent.captureScreenHtml` we hide the bottom bar, and ask for the file name. We then send a message to the bg script
with the filename. Background script can then call savePage/saveTabs 
- [ ] Update the method signatures to follow the parameter order -  spaceId, apiKey, selectedTidbitCollection, selectedDemo. Or follow the similar pattern.
- [ ] Remove all references to localStorage in the content script. Just do it for the flows implemented so far.

  
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts
