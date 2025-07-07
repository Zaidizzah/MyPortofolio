document.addEventListener("DOMContentLoaded", function () {
  // Animate elements on load
  const elements = document.querySelectorAll(
    ".error-code, .error-title, .error-message"
  );
  elements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "all 0.6s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 200);
  });

  // Add interactive effects to tech tags
  const techTags = document.querySelectorAll(".tech-tag");
  techTags.forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)";
    });

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add typing effect to code snippet
  const codeLines = document.querySelectorAll(".code-snippet div");
  codeLines.forEach((line, index) => {
    line.style.opacity = "0";
    setTimeout(() => {
      line.style.transition = "opacity 0.3s ease";
      line.style.opacity = "1";
    }, 1000 + index * 100);
  });
});
