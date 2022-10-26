class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="highlight"> element
    this.highlight = el.querySelector('.highlight');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();

    if (this.el.dataset.level == "2") {
      var preamble = this.el.querySelector(".preamble") != null;
      var expandable = this.el.querySelector("details.expand") != null;
      if (preamble && expandable) {
        this.el.dataset.cyclevis = true;
      }
    }

    if (this.el.dataset.cyclevis) {
      if (this.el.dataset.cycle == null) {
        this.el.dataset.cycle = "0";
      }

      if (this.el.dataset.cycle == "0") {
        this.el.querySelector('.preamble').style.display = "none";
        this.el.querySelectorAll('details.expand').forEach((el) => {
          el.open = false;
        });
        this.el.open = true;
        this.summary.classList.add("level");
        this.el.dataset.cycle = String((1 + Number(this.el.dataset.cycle)) % 3);
      } else if (this.el.dataset.cycle == "1") {
        this.el.querySelector('.preamble').style.display = "block";
        this.el.querySelectorAll('details.expand').forEach((el) => {
          el.open = true;
        });
        this.summary.classList.remove("level");
        this.el.dataset.cycle = String((1 + Number(this.el.dataset.cycle)) % 3);
      } else {
        this.shrink()
        this.el.dataset.cycle = String((1 + Number(this.el.dataset.cycle)) % 3);
      }

    } else {
      // Add an overflow on the <details> to avoid highlight overflowing
      this.el.style.overflow = 'hidden';
      if (this.isClosing || !this.el.open) {
        this.open();
        // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }

    // Check if the element is being closed or is already closed
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    
    // Store the current height of the element
    var startHeightNum = this.el.offsetHeight;
    var startHeight = `${this.el.offsetHeight - 15}px`;
    // Calculate the height of the summary
    var endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    var duration = 200;

    if (startHeightNum > window.innerHeight) {
      // Start a WAAPI animation
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [`${window.innerHeight}px`, endHeight]
      }, {
        duration: duration,
        easing: 'ease-in'
      });
    } else {
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: duration,
        easing: 'ease-in'
      });
    }

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => {this.onAnimationFinish(false);
                                     this.summary.classList.add("level");
                                     this.el.height = endHeight;
                                    };

    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // console.log(this.el.dataset.level);
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    if (this.el.dataset.cyclevis) {
      var startHeight = `${this.summary.offsetHeight + this.el.offsetHeight}px`;
    } else {
      var startHeight = `${this.el.offsetHeight}px`;
    }
    // Calculate the open height of the element (summary height + highlight height)
    var endHeightNum = this.summary.offsetHeight + this.highlight.offsetHeight;
    var endHeight = "";

    if (this.el.class == "expand") {
      endHeight = `${this.summary.offsetHeight + this.highlight.offsetHeight}px`;
    } else {
      endHeight = `${this.summary.offsetHeight + this.highlight.offsetHeight + 15}px`;
    }

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    if (endHeightNum > window.innerHeight) {
      // Start a WAAPI animation
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, `${window.innerHeight}px`]
      }, {
        duration: 200,
        easing: 'ease-out'
      });
    } else {
      // Start a WAAPI animation
      this.animation = this.el.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 200,
        easing: 'ease-out'
      });

    }
    if (this.el.dataset.cycle != "1") {
      this.summary.classList.remove("level");
    }

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => {this.onAnimationFinish(true);
                                     this.el.height = endHeight;
                                     };
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}


document.querySelectorAll('details').forEach((el) => {
  new Accordion(el);
});
