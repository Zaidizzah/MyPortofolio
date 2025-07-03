document.addEventListener("DOMContentLoaded", function () {
  const mainElement = document.querySelector("main.main--section-page");
  if (mainElement) {
    setTimeout(function () {
      mainElement.classList.add("rendered-page");
    }, 500);
  }
});
