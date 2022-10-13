/**
 * Adopt:
 * the theme from the system preferences; or
 * the previously stored mode from the `localStorage`
 */
var initialMode = "light";
var prefersColorSchemeDark = window.matchMedia( "(prefers-color-scheme: dark)" );

if ( prefersColorSchemeDark.matches ) {
    initialMode = "dark";
}

if( localStorage.getItem("initialMode") == null ) {
    localStorage.setItem("initialMode", initialMode);
}

if( localStorage.getItem("currentMode") == null ) {
    localStorage.setItem("currentMode", initialMode);
} else {
    let currentMode = localStorage.getItem("currentMode");
    if ( currentMode == "dark" && currentMode != initialMode ) {
        document.body.classList.add("doom-one");
        document.querySelectorAll("pre.chroma").forEach((pre) => {
            pre.classList.remove("github");
            pre.classList.add("doom-one");
        })
    } else if ( currentMode == "light" && currentMode != initialMode ) {
        document.querySelectorAll("pre.chroma").forEach((pre) => {
            pre.classList.add("github");
            pre.classList.remove("doom-one");
        })
    }
}

function switchHighlight() {
    document.querySelectorAll("pre.chroma").forEach((pre) => {
        if ( currentMode == "dark" && currentMode == initialMode ) {
            pre.classList.add("github");
            pre.classList.remove("doom-one");
            localStorage.setItem("currentMode", "light");
        } else if ( currentMode == "light" && currentMode == initialMode ) {
            pre.classList.remove("github");
            pre.classList.add("doom-one");
            localStorage.setItem("currentMode", "dark");
        } else if ( currentMode != initialMode ) {
            // document.body.removeAttribute("class");
            if( currentMode == "dark" ) {
                localStorage.setItem("currentMode", "light");
            } else {
                localStorage.setItem("currentMode", "dark");
            }
        }
    });
}

/**
 * Process the toggle then store to `localStorage`
 */
document.getElementById('theme-switch').addEventListener("onchange", function() {
    var initialMode = localStorage.getItem("initialMode");
    let currentMode = localStorage.getItem("currentMode");
    switchHighlight();
}, false);
