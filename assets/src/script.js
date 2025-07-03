document.getElementById("year-copyright").textContent =
  new Date().getFullYear();

// navbar responsive
function toggleMenu() {
  const nav = document.querySelector("#myNavContainer #myNav");
  const menuIcon = document.querySelector(".menu-icon");
  menuIcon.classList.toggle("active");
  nav.classList.toggle("animate-fade-in");
  nav.classList.toggle("active");

  if (nav.classList.contains("active")) {
    nav.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    document
      .querySelector("section:first-child")
      .scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
// Script untuk tombol Scroll to Top
const scrollToTopButton = document.getElementById("scrollToTop");

// Tampilkan tombol setelah scroll 300px
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopButton.classList.add("visible");
  } else {
    scrollToTopButton.classList.remove("visible");
  }
});

// Fungsi scroll to top
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// lightbox image preview
function openLightbox(img) {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxDesc = document.getElementById("lightbox-desc");

  lightbox.style.display = "block";
  lightboxImg.src = img.src;
  lightboxDesc.innerHTML = img.getAttribute("data-description");
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Close lightbox when clicking outside the image
window.onclick = function (event) {
  var lightbox = document.getElementById("lightbox");
  if (event.target == lightbox) {
    lightbox.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all sections and cards
  document.querySelectorAll("section, .card").forEach((el) => {
    observer.observe(el);
  });

  // Add active class to navigation links on scroll
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Parallax effect for background images
  const parallaxSections = document.querySelectorAll(".parallax");
  window.addEventListener("scroll", () => {
    parallaxSections.forEach((section) => {
      const distance = window.pageYOffset;
      const speed = section.dataset.speed;
      section.style.backgroundPositionY = `${distance * speed}px`;
    });
  });

  // Animate skill bars
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar) => {
    const percentage = bar.dataset.percentage;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = percentage;
      bar.style.transition = "width 1s ease-in-out";
    }, 500);
  });

  // Typing effect for the header
  const typingElement = document.querySelector(".typing-effect");
  const phrases = ["Zaid Izzah Nurbaain", "Web Developer", "Backend Developer"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
  }

  typeEffect();

  // Form validation
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      if (nameInput.value.trim() === "") {
        showError(nameInput, "Name is required");
      } else {
        removeError(nameInput);
      }

      if (emailInput.value.trim() === "") {
        showError(emailInput, "Email is required");
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email");
      } else {
        removeError(emailInput);
      }

      if (messageInput.value.trim() === "") {
        showError(messageInput, "Message is required");
      } else {
        removeError(messageInput);
      }

      if (contactForm.querySelectorAll(".error-message").length === 0) {
        // Form is valid, you can submit it or handle it as needed
        alert("Form submitted successfully!");
        contactForm.submit();
        contactForm.reset();
      }
    });
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement =
      formGroup.querySelector(".error-message") ||
      document.createElement("div");
    errorElement.className = "error-message text-danger mt-1";
    errorElement.textContent = message;
    if (!formGroup.querySelector(".error-message")) {
      formGroup.appendChild(errorElement);
    }
  }

  function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector(".error-message");
    if (errorElement) {
      formGroup.removeChild(errorElement);
    }
  }

  function isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});
