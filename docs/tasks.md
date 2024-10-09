# Current Work
Note: The work needs to be done in small PR which will be reviewed and merged quickly.  Create a new branch from 
`sherwani/addedScreens` and then once done with the first task, create a PR and then wait for the merge. Repeat this 
process for each task.

The PR will be created against the `sherwani/addedScreens` branch, and not the `main` branch. Because we want all
the changes in the `sherwani/addedScreens` branch to look good before merging it to the `main` branch.

# PRs

### PR 1
- [x] pass everything in a data wrapper except the method. This is try both ways
- [x] Add validation and displaying of the logic
- [x] remove extra code from extensionIconClicked function
- video for error handling of spaceId and ApiKey https://www.loom.com/share/d4177fd7d8524f3f843ccdd893564755?sid=8e0fe4b5-780e-4693-ae93-43153c7f8dd2
- [x] In saveSpaceIdAndApiKey function, if the spaceId, and api key are present then send the message to the content
{message: 'dodaoContent.selectClickableDemo', data: {spaceId, apiKey}}
- [x] Using this message, the content script will show the select clickable demo screen. We already have these screens,
resuse the exact logic, means call those functions.
- [x] When the user selects the clickable demo, then send the message to the background script 
{ message: 'dodaoBg.saveSelectedClickableDemo', data: { selectedClickableDemo, selectedTidbitCollection }}. We can
pass the full objects and save the full object in the storage, because we will need the names also.
- [x] In the background script, add validations, and send the error, and show the error on UI if there is.
- [x] Display of the error can be a common function, which we can include in all screens.

- complete functioning:https://www.loom.com/share/1600748d11184d60a359e9afcaf3e082?sid=48a0aad4-e21f-4381-9d8a-d7e7c1c8af3d
NOTE. Make video with the error scenarios as well. 

- error handling of collection and demo:https://www.loom.com/share/36360720b3774e70b3cececbb0d6c23b?sid=1ef58bc1-8c9b-4404-bceb-01c04bfe9fe7

### PR 2

 
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts
