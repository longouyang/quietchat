const CDP = require('chrome-remote-interface');



function setupQuieter() {
    let rawStyle = `
.quietstyle .c-mention_badge { display: none }

.quietstyle .p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted):not(.p-channel_sidebar__channel--suggested) .p-channel_sidebar__name {
    font-weight: 400; color: inherit !important;
}

.quietstyle .c-button-unstyled.p-channel_sidebar__banner.p-channel_sidebar__banner--mentions {
  display: none;
}

.quietstyle .p-channel_sidebar__link--unread .p-channel_sidebar__name {
  font-weight: 400; color: inherit !important;
}

.quietstyle button.c-button-unstyled.p-channel_sidebar__banner.p-channel_sidebar__banner--unreads {
    display: none
}

.quietstyle .p-team_sidebar__unread_dot  {
  display: none !important
}

.quietstyle .p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted):not(.p-channel_sidebar__channel--selected) .p-channel_sidebar__channel_icon_prefix:not(.c-presence):not(.p-channel_sidebar__channel_icon_prefix--sidebar_simplification) {
  color: inherit !important
}

.quietstyle .p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted):not(.p-channel_sidebar__channel--suggested):not(.p-channel_sidebar__channel--typing) .p-channel_sidebar__channel_icon_prefix.c-icon--channel-pane-hash::before {
  content: '\E125' !important;
}

.quietstyle .c-icon--mentions:before {
  content: '\E009' !important;
}

.quietstyle .p-threads_view__bottom_banners {
  display: none !important;
}

.quietstyle .p-team_sidebar__unread_dot {
  display: none;
}

.quietstyle .p-team_sidebar__mentions_badge {
  display: none;
}

.quietstyle .quiettoggler {
    border: 1px solid gray; border-radius: 2px; float: left; padding: 3px;
}

.quietstyle .quiettoggler:active {
    background-color: black; color: white; float: left; padding: 3px; border: 1px solid white;
}
`
    // check if we've already set up a style
    let styleEl = document.getElementById('quiet-style-creator')
    if (styleEl === null) {
        let styleDefs = rawStyle.trim().split("\n\n").map((def) => def.replace(/\n/g," "))
        styleEl = document.createElement('style')
        styleEl.setAttribute('id','quiet-style-creator')

        for (var styleDef of styleDefs) {
            styleEl.innerHTML += styleDef;
            styleEl.innerHTML += "\n"
        }
        document.head.appendChild(styleEl);

        let navArea = document.getElementsByClassName('p-top_nav__right')[0];
        let toggleButton = document.createElement('button');
        toggleButton.classList.add('quiettoggler')
        toggleButton.setAttribute('id','quiet-toggler')
        toggleButton.innerText='toggle quiet'
        toggleButton.onclick = function() {
            let bodyClassList = Array.prototype.slice.call(document.body.classList,0);

            if (!bodyClassList.some((cls) => cls==='quietstyle')) {
                document.body.classList.add('quietstyle')
            } else {
                document.body.classList.remove('quietstyle')
            }        
        }
        navArea.prepend(toggleButton)
    }    
}



CDP({host: 'localhost', port: 2121},
async function(client) {
    // extract domains
    const {Network, Page, Runtime} = client;
    try {
        await Network.enable();
        await Page.enable();
        // network events
        Network.responseReceived((params) => {
            console.log(params.response.url);
        });


        console.log('INJECTING JAVASCRIPT')
        const expression = setupQuieter.toString()
        console.log(expression)

        let evaluateResult = await Runtime.evaluate({
          expression: expression
        });

        console.log(evaluateResult);

        evaluateResult = await Runtime.evaluate({
            expression: 'setupQuieter();'
          });

        console.log(evaluateResult);
  

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}).on('error', (err) => {
    // cannot connect to the remote endpoint
    console.error(err);
});