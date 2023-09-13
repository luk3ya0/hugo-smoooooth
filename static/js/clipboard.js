/* global clipboard */
/* eslint-disable no-console */

function addCopyButtons(clipboard) {
    document.querySelectorAll('div.gutter button').forEach((button) => {
	    button.addEventListener('click', () => {
 	        var target = button.parentElement.nextElementSibling.querySelector('pre > code');
            clipboard.writeText(target.innerText).then(
                function() {
                    /* Chrome doesn't seem to blur automatically, leaving the button
                       in a focused state */
		    var innerHTML = button.innerHTML;
		    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="green" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>'
                    setTimeout(function() {
		        button.innerHTML = innerHTML;
                    }, 2000);
                },
                function(error) {
		    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path fill="red" d="M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939 8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6 9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061 3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6 2.22 3.28a.749.749 0 0 1 0-1.06Z"></path></svg>'
                    console.error(error);
                }
            );
	    });
    });
}

if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
} else {
    var script = document.createElement('script');
    script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
    script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
    script.crossOrigin = 'anonymous';

    script.onload = function() {
        addCopyButtons(clipboard);
    };

    document.body.appendChild(script);
}
