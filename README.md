adds a `toggle quiet` button to the upper right corner of the Slack app -- clicking this button will toggle silencing of all notifications.
this can be useful if you need to look up information in slack but dont want to be distracted by new messages.

currently it's a little buggy and is only optimized to work with the "Hoth" visual theme.

installation:

```
npm install
```

running:

```
open -a Slack --args --remote-debugging-port=2121 # first run slack with remote debugging port open (OSX)
node index.js
```

this works by injecting custom CSS / JS into the electron app
