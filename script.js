// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  const body = document.body
  const themeIcon = document.querySelector(".theme-icon")

  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem("theme") || "dark"

  // Apply the saved theme
  if (currentTheme === "light") {
    body.classList.add("light-mode")
    body.classList.remove("dark-mode")
    themeIcon.textContent = "☀️"
  } else {
    body.classList.add("dark-mode")
    body.classList.remove("light-mode")
    themeIcon.textContent = "🌙"
  }

  // Theme toggle event listener
  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode")
      body.classList.add("light-mode")
      themeIcon.textContent = "☀️"
      localStorage.setItem("theme", "light")
    } else {
      body.classList.remove("light-mode")
      body.classList.add("dark-mode")
      themeIcon.textContent = "🌙"
      localStorage.setItem("theme", "dark")
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add scroll effect to navbar
  let lastScrollTop = 0
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .center-card, .tech-card, .service-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number")

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace("+", ""))
      const increment = target / 100
      let current = 0

      const updateCounter = () => {
        if (current < target) {
          current += increment
          counter.textContent = Math.ceil(current) + (counter.textContent.includes("+") ? "+" : "")
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target + (counter.textContent.includes("+") ? "+" : "")
        }
      }

      updateCounter()
    })
  }

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector(".stats")
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    statsObserver.observe(statsSection)
  }

  // Add hover effects to cards
  document.querySelectorAll(".feature-card, .center-card, .tech-card, .service-item").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Mobile menu toggle (if needed for smaller screens)
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Add active class to current page nav link
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
})

// Utility function to create floating particles effect
function createParticles() {
  const hero = document.querySelector(".hero")
  if (!hero) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-orange);
            border-radius: 50%;
            opacity: 0.3;
            animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1;
        `
    hero.appendChild(particle)
  }
}

// Add particle animation keyframes
const style = document.createElement("style")
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Initialize particles on page load
document.addEventListener("DOMContentLoaded", createParticles)
