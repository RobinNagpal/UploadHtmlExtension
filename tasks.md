# Getting Understanding
- What are the basic files for chrome extension
- What are options and are they supported, and what is the recommended way of showing the options 
- What is a content script and how to use it
- What is a background script and how to use it
- What things should be done in content script and what in background script
- When we click on the extension icon what really happens, like what gets invoked? Are there options around this?
- How to keep the extension loaded for all tabs, but only in that session, and not in all sessions. (This is what we 
wanted to do in our app, but currently its done for all sessions and it causes an issue). By session here, I mean not impacting any
other tab or browser window.
- IS local storage available in content script and background script?
- How to communicate between content script and background script? Back and forth.
- What is the best way to pass data from content script to background script and vice versa?

 
# Work
- [ ] Make the environment url configurable by importing the base url from a single file. You can probably create a 
file called dodao-constants.ts

