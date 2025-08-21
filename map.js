// Organizational Map Functionality
document.addEventListener("DOMContentLoaded", () => {
  const orgMap = document.getElementById("orgMap")
  const connectionsLayer = document.getElementById("connections")
  const hierarchyBtn = document.getElementById("hierarchyView")
  const networkBtn = document.getElementById("networkView")
  const matrixBtn = document.getElementById("matrixView")

  if (!orgMap) return // Exit if not on the map page

  let currentView = "hierarchy"

  // Node positions for different views
  const nodePositions = {
    hierarchy: {
      root: { x: 50, y: 10 },
      lifecycle: { x: 15, y: 25 },
      expertise: { x: 30, y: 25 },
      delivery: { x: 45, y: 25 },
      ecosystem: { x: 60, y: 25 },
      incubation: { x: 75, y: 40 },
      infrastructure: { x: 85, y: 40 },
      performance: { x: 15, y: 55 },
      cyber: { x: 30, y: 55 },
      "cx-centers": { x: 10, y: 70 },
      "cx-tech": { x: 20, y: 70 },
    },
    network: {
      root: { x: 50, y: 50 },
      lifecycle: { x: 30, y: 20 },
      expertise: { x: 70, y: 20 },
      delivery: { x: 80, y: 50 },
      ecosystem: { x: 70, y: 80 },
      incubation: { x: 30, y: 80 },
      infrastructure: { x: 20, y: 50 },
      performance: { x: 50, y: 20 },
      cyber: { x: 50, y: 80 },
      "cx-centers": { x: 15, y: 35 },
      "cx-tech": { x: 15, y: 65 },
    },
    matrix: {
      root: { x: 10, y: 10 },
      lifecycle: { x: 30, y: 10 },
      expertise: { x: 50, y: 10 },
      delivery: { x: 70, y: 10 },
      ecosystem: { x: 90, y: 10 },
      incubation: { x: 30, y: 40 },
      infrastructure: { x: 50, y: 40 },
      performance: { x: 70, y: 40 },
      cyber: { x: 90, y: 40 },
      "cx-centers": { x: 30, y: 70 },
      "cx-tech": { x: 50, y: 70 },
    },
  }

  // Connection definitions
  const connections = [
    { from: "root", to: "lifecycle" },
    { from: "root", to: "expertise" },
    { from: "root", to: "delivery" },
    { from: "root", to: "ecosystem" },
    { from: "root", to: "incubation" },
    { from: "root", to: "infrastructure" },
    { from: "root", to: "performance" },
    { from: "root", to: "cyber" },
    { from: "lifecycle", to: "cx-centers" },
    { from: "lifecycle", to: "cx-tech" },
    { from: "expertise", to: "cx-centers" },
    { from: "delivery", to: "cx-tech" },
  ]

  // Initialize map
  function initializeMap() {
    positionNodes(currentView)
    drawConnections()
    addNodeInteractions()
  }

  // Position nodes based on current view
  function positionNodes(view) {
    const nodes = orgMap.querySelectorAll(".org-node")
    const positions = nodePositions[view]

    nodes.forEach((node) => {
      const functionName = node.getAttribute("data-function")
      if (positions[functionName]) {
        const pos = positions[functionName]
        node.style.left = pos.x + "%"
        node.style.top = pos.y + "%"
        node.style.transform = "translate(-50%, -50%)"

        // Add animation delay based on level
        const level = Number.parseInt(node.getAttribute("data-level")) || 0
        node.style.animationDelay = level * 0.2 + "s"
      }
    })
  }

  // Draw connections between nodes
  function drawConnections() {
    if (!connectionsLayer) return

    connectionsLayer.innerHTML = ""
    const mapRect = orgMap.getBoundingClientRect()

    connections.forEach((connection, index) => {
      const fromNode = orgMap.querySelector(`[data-function="${connection.from}"]`)
      const toNode = orgMap.querySelector(`[data-function="${connection.to}"]`)

      if (fromNode && toNode) {
        const fromRect = fromNode.getBoundingClientRect()
        const toRect = toNode.getBoundingClientRect()

        const fromX = fromRect.left + fromRect.width / 2 - mapRect.left
        const fromY = fromRect.top + fromRect.height / 2 - mapRect.top
        const toX = toRect.left + toRect.width / 2 - mapRect.left
        const toY = toRect.top + toRect.height / 2 - mapRect.top

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", fromX)
        line.setAttribute("y1", fromY)
        line.setAttribute("x2", toX)
        line.setAttribute("y2", toY)
        line.setAttribute(
          "stroke",
          getComputedStyle(document.documentElement).getPropertyValue("--primary-orange").trim(),
        )
        line.setAttribute("stroke-width", "2")
        line.setAttribute("opacity", "0.6")
        line.style.animation = `drawLine 1s ease-out ${index * 0.1}s both`

        connectionsLayer.appendChild(line)
      }
    })
  }

  // Add interaction effects to nodes
  function addNodeInteractions() {
    const nodes = orgMap.querySelectorAll(".org-node")

    nodes.forEach((node) => {
      node.addEventListener("mouseenter", function () {
        this.style.zIndex = "10"
        this.style.transform = "translate(-50%, -50%) scale(1.1)"

        // Highlight connected nodes
        const functionName = this.getAttribute("data-function")
        highlightConnections(functionName, true)
      })

      node.addEventListener("mouseleave", function () {
        this.style.zIndex = "2"
        this.style.transform = "translate(-50%, -50%) scale(1)"

        // Remove highlights
        const functionName = this.getAttribute("data-function")
        highlightConnections(functionName, false)
      })

      node.addEventListener("click", function () {
        const functionName = this.getAttribute("data-function")
        showNodeDetails(functionName)
      })
    })
  }

  // Highlight connections for a specific node
  function highlightConnections(functionName, highlight) {
    const lines = connectionsLayer.querySelectorAll("line")
    const relatedConnections = connections.filter((conn) => conn.from === functionName || conn.to === functionName)

    lines.forEach((line, index) => {
      const connection = connections[index]
      if (relatedConnections.includes(connection)) {
        line.setAttribute("stroke-width", highlight ? "4" : "2")
        line.setAttribute("opacity", highlight ? "1" : "0.6")
      }
    })
  }

  // Show detailed information about a node
  function showNodeDetails(functionName) {
    const nodeData = {
      root: {
        title: "Global Platform & Services",
        description:
          "Enterprise-wide service delivery framework encompassing all operational functions and technologies.",
        details: ["Strategic oversight", "Service coordination", "Quality assurance", "Performance management"],
      },
      lifecycle: {
        title: "Lifecycle Management",
        description:
          "End-to-end experience management across customer, employee, operational, and digital touchpoints.",
        details: ["Customer Experience", "Employee Experience", "Operational Experience", "Digital Experience"],
      },
      expertise: {
        title: "Domain Expertise",
        description: "Specialized knowledge and capabilities across key experience domains.",
        details: ["Customer Experience Expertise", "Employee Experience Expertise", "Digital Experience Expertise"],
      },
      delivery: {
        title: "Service Delivery",
        description: "Comprehensive service delivery across all experience channels and platforms.",
        details: ["Customer Service Delivery", "Employee Service Delivery", "Digital Service Delivery"],
      },
      ecosystem: {
        title: "Technology Ecosystem",
        description:
          "Infrastructure and platform management including data centers, security, and vendor relationships.",
        details: [
          "Data Centers Management",
          "Security Operations",
          "Monitoring & Admin Zone",
          "Vendor Management",
          "AI Skill Center",
        ],
      },
    }

    const data = nodeData[functionName]
    if (data) {
      alert(`${data.title}\n\n${data.description}\n\nKey Areas:\n${data.details.join("\n")}`)
    }
  }

  // View switching functionality
  function switchView(newView) {
    if (newView === currentView) return

    currentView = newView

    // Update button states
    document.querySelectorAll(".map-controls .btn").forEach((btn) => {
      btn.classList.remove("btn-primary")
      btn.classList.add("btn-secondary")
    })

    const activeBtn = document.getElementById(newView + "View")
    if (activeBtn) {
      activeBtn.classList.remove("btn-secondary")
      activeBtn.classList.add("btn-primary")
    }

    // Animate to new positions
    positionNodes(newView)

    // Redraw connections after a delay
    setTimeout(() => {
      drawConnections()
    }, 300)
  }

  // Event listeners for view buttons
  if (hierarchyBtn) {
    hierarchyBtn.addEventListener("click", () => switchView("hierarchy"))
  }
  if (networkBtn) {
    networkBtn.addEventListener("click", () => switchView("network"))
  }
  if (matrixBtn) {
    matrixBtn.addEventListener("click", () => switchView("matrix"))
  }

  // Add CSS for line drawing animation
  const mapStyle = document.createElement("style")
  mapStyle.textContent = `
        @keyframes drawLine {
            from {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
            }
            to {
                stroke-dasharray: 1000;
                stroke-dashoffset: 0;
            }
        }
        
        .org-node {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .connections line {
            transition: all 0.3s ease;
        }
    `
  document.head.appendChild(mapStyle)

  // Initialize the map
  initializeMap()

  // Redraw connections on window resize
  let resizeTimeout
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      drawConnections()
    }, 250)
  })

  // Auto-rotate through views (optional)
  let autoRotateInterval
  function startAutoRotate() {
    const views = ["hierarchy", "network", "matrix"]
    let currentIndex = 0

    autoRotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % views.length
      switchView(views[currentIndex])
    }, 10000) // Switch every 10 seconds
  }

  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval)
    }
  }

  // Start auto-rotate after 5 seconds of inactivity
  let inactivityTimer
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer)
    stopAutoRotate()

    inactivityTimer = setTimeout(() => {
      startAutoRotate()
    }, 5000)
  }

  // Reset timer on user interaction
  orgMap.addEventListener("mousemove", resetInactivityTimer)
  orgMap.addEventListener("click", resetInactivityTimer)
  document.querySelectorAll(".map-controls .btn").forEach((btn) => {
    btn.addEventListener("click", resetInactivityTimer)
  })

  // Start the inactivity timer
  resetInactivityTimer()
})
