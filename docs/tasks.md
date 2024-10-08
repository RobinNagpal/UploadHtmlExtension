# Current Work
Note: The work needs to be done in small PR which will be reviewed and merged quickly.  Create a new branch from 
`sherwani/addedScreens` and then once done with the first task, create a PR and then wait for the merge. Repeat this 
process for each task.

The PR will be created against the `sherwani/addedScreens` branch, and not the `main` branch. Because we want all
the changes in the `sherwani/addedScreens` branch to look good before merging it to the `main` branch.

# PRs

### PR 1
- [ ] pass everything in a data wrapper except the method. This is try both ways
- [ ] Add validation and displaying of the logic
- [ ] remove extra code from extensionIconClicked function
- [ ] In saveSpaceIdAndApiKey function, if the spaceId, and api key are present then send the message to the content
{message: 'dodaoContent.selectClickableDemo', data: {spaceId, apiKey}}
- [ ] Using this message, the content script will show the select clickable demo screen. We already have these screens,
resuse the exact logic, means call those functions.
- [ ] When the user selects the clickable demo, then send the message to the background script 
{ message: 'dodaoBg.saveSelectedClickableDemo', data: { selectedClickableDemo, selectedTidbitCollection }}. We can
pass the full objects and save the full object in the storage, because we will need the names also.
- [ ] In the background script, add validations, and send the error, and show the error on UI if there is.
- [ ] Display of the error can be a common function, which we can include in all screens.

NOTE. Make video with the error scenarios as well. 

### PR 2

 
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts
