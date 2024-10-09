# Current Work
Note: The work needs to be done in small PR which will be reviewed and merged quickly.  Create a new branch from 
`sherwani/addedScreens` and then once done with the first task, create a PR and then wait for the merge. Repeat this 
process for each task.

The PR will be created against the `sherwani/addedScreens` branch, and not the `main` branch. Because we want all
the changes in the `sherwani/addedScreens` branch to look good before merging it to the `main` branch.

# PRs

### PR 1
- [ ] In `dodaoExtensionIconClicked` in the else block, which is when we have all the data, we need to call the
`sendMethodMessage("dodaoContent.renderBottomBar")`
- [ ] In `saveSelectedCollectionAndDemoId` also on successful save, we call `sendMethodMessage("dodaoContent.renderBottomBar")`
- [ ] When sending this message, we send all the four pieces of data we have to the content script
- [ ] We write a corresponding method in content script which uses the existing code to shw the bottom bar
- [ ] When the bottom bar capture is clicked send a message to bg script to start downloading the page. This can then call the
existing code of save tab

### PR 2

 
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts
