(() => {
  "use strict";

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

  // Tooltips accessibility
  const tooltipTriggerElements = document.querySelectorAll(
    '[data-tooltip="true"]'
  );
  if (tooltipTriggerElements) {
    tooltipTriggerElements.forEach((element, index) => {
      // set attribute aria-describedby
      element.setAttribute(
        "aria-describedby",
        `tooltip--section-page-${index}`
      );

      element.addEventListener("mouseover", function () {
        const existingTooltip = document.getElementById(
          `tooltip--section-page-${index}`
        );
        // Delete existing tooltip
        if (existingTooltip) {
          existingTooltip.parentNode.removeChild(existingTooltip);
        }

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("tooltip--section-page");
        tooltipElement.role = "tooltip";
        tooltipElement.tabIndex = "-1";
        tooltipElement.id = `tooltip--section-page-${index}`;
        tooltipElement.ariaExpanded = "true";
        tooltipElement.setAttribute("aria-assertive", "polite");

        const tooltipElementContent = document.createElement("p");
        tooltipElementContent.textContent = element.dataset.tooltipTitle;
        tooltipElementContent.classList.add("tooltip--section-page-content");

        // Configure tooltip position
        const tooltipElementPosition = element.getBoundingClientRect();
        tooltipElement.style.position = "fixed";
        tooltipElement.style.left = `${tooltipElementPosition.left}px`;
        tooltipElement.style.top = `${
          tooltipElementPosition.top + tooltipElementPosition.height + 4
        }px`;

        tooltipElement.appendChild(tooltipElementContent);
        document.body?.appendChild(tooltipElement);
      });

      element.addEventListener("mouseout", function (event) {
        const tooltipElement = document.getElementById(
          `tooltip--section-page-${index}`
        );
        if (tooltipElement) {
          tooltipElement.style.opacity = "0";

          setTimeout(function () {
            if (tooltipElement.parentNode) {
              tooltipElement.parentNode.removeChild(tooltipElement);
            }
          }, 300);
        }
      });
    });
  }

  // Adding role "heading" to all element heading with class "...title"
  const headingElements = document.querySelectorAll(
    "h1[class$='title'], h2[class$='title'], h3[class$='title'], h4[class$='title'], h5[class$='title'], h6[class$='title']"
  );
  if (headingElements) {
    headingElements.forEach((element) => {
      if (element.role === undefined || element.role !== "heading") {
        element.setAttribute("role", "heading");
      }
    });
  }
})();
