document.addEventListener("DOMContentLoaded", function () {
  const mainElement = document.querySelector("main.main--section-page");
  if (mainElement) {
    setTimeout(function () {
      mainElement.classList.add("rendered-page");
    }, 500);
  }

  // Scrolling animation triggered animation of progress bar skills
  const skillBarObservers = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger animation and adding width value
        entry.target.classList.add("animate");

        // Fill bar
        const fillBar = entry.target.querySelector(
          ".section--page-skills-bar-item-bar-fill"
        );
        if (fillBar && fillBar.dataset.value !== undefined) {
          // FLEXBASIS property
          fillBar.style.setProperty("--flex-basis", `${fillBar.dataset.value}`);
          fillBar.style.flexBasis = fillBar.dataset.value;

          // WIDTH property
          fillBar.style.setProperty("--width", `${fillBar.dataset.value}`);
          fillBar.style.width = fillBar.dataset.value;
        }

        // Empty bar
        const emptyBar = entry.target.querySelector(
          ".section--page-skills-bar-item-bar-empty"
        );
        if (emptyBar && emptyBar.dataset.value !== undefined) {
          // FLEXBASIS property
          emptyBar.style.setProperty("--flex-basis", emptyBar.dataset.value);
          emptyBar.style.flexBasis = emptyBar.dataset.value;

          // WIDTH property
          emptyBar.style.setProperty("--width", emptyBar.dataset.value);
          emptyBar.style.width = emptyBar.dataset.value;
        }

        // Unobserve element
        skillBarObservers.unobserve(entry.target);
      }
    });
  });

  const skillBarElements = document.querySelectorAll(
    ".section--page-skills-bar-item-bar"
  );
  skillBarElements.forEach((element) => {
    skillBarObservers.observe(element);
  });
});
