(() => {
  "use strict";

  // Initialize style before closed tag head
  const SKILLS_NETWORK_STYLE = document.createElement("style");
  SKILLS_NETWORK_STYLE.id = "skills-network-style";
  SKILLS_NETWORK_STYLE.setAttribute("type", "text/css");
  SKILLS_NETWORK_STYLE.role = "stylesheet";
  SKILLS_NETWORK_STYLE.ariaLabel = "Style for Skills Network Graph";
  SKILLS_NETWORK_STYLE.innerHTML = `
        #skills-network-canvas {
          position: relative;
          width: 100%;
          height: 100%;
        }
  
        #skills-network-canvas {
              width: 100%;
              height: 600px;
              max-height: 1200px;
              margin-top: var(--gap--small);
              background-color: var(--color-background--default);
              border: 1px solid var(--color-border--tertiary);
              box-shadow: 8px 12px 0 0 var(--color-background--light);
              cursor: grab;
              opacity: 0;
              animation: fadeIn 1.5s ease-in forwards;
          }
  
          #skills-network-canvas:active {
              cursor: grabbing;
          }
  
          @keyframes fadeIn {
              from {
                  opacity: 0;
                  transform: scale(0.95);
              }
              to {
                  opacity: 1;
                  transform: scale(1);
              }
          }
      `;
  document.head.appendChild(SKILLS_NETWORK_STYLE);

  // Check if SKILLS_NETWORK_STYLE is appended in head
  if (document.head.contains(SKILLS_NETWORK_STYLE)) {
    console.log("SKILLS_NETWORK_STYLE is appended in head");
  } else {
    console.warn("SKILLS_NETWORK_STYLE is not appended in head");
    return;
  }

  const CANVAS = document.querySelector("canvas#skills-network-canvas"),
    CTX = CANVAS.getContext("2d"),
    SKILLS_DATA = [
      { name: "JavaScript", category: "frontend", size: 30 },
      { name: "HTML", category: "frontend", size: 26 },
      { name: "CSS", category: "frontend", size: 27 },
      { name: "PHP", category: "backend", size: 24 },
      { name: "Node.js", category: "backend", size: 28 },
      { name: "Visual Basic", category: "backend", size: 27 },
      { name: "Laravel", category: "backend", size: 25 },
      { name: "Codeigniter", category: "backend", size: 27 },
      { name: "Visual FoxPro 9", category: "backend", size: 39 },
      { name: "Java", category: "backend", size: 23 },
      { name: "C#", category: "backend", size: 22 },
      { name: ".NET", category: "backend", size: 24 },
      { name: "PostgreSQL", category: "database", size: 29 },
      { name: "MySQL", category: "database", size: 23 },
      { name: "Docker", category: "devops", size: 26 },
      { name: "Git", category: "devops", size: 28 },
      { name: "Excel VBA", category: "backend", size: 24 },
      { name: "Microsoft Access", category: "backend", size: 46 },
      { name: "REST API", category: "backend", size: 25 },
      { name: "WebSocket", category: "backend", size: 25 },
      { name: "SQLite", category: "database", size: 25 },
      { name: "C# Windows Forms", category: "backend", size: 49 },
      { name: "C# WPF", category: "backend", size: 22 },
      { name: "Aseprite", category: "other", size: 22 },
      { name: "Photoshop", category: "other", size: 26 },
      { name: "Figma", category: "other", size: 24 },
      { name: "Tesseract OCR", category: "backend", size: 39 },
    ],
    COLORS_FOR_CATEGORY = {
      frontend: "#667eea",
      backend: "#f093fb",
      database: "#4facfe",
      devops: "#43e97b",
      testing: "#fa709a",
      other: "#FF937E",
    };

  // Initialize nodes with starting positions from sides
  const NODES = SKILLS_DATA.map((skill, i) => {
    // Determine which side to start from (left, right, top, bottom)
    const side = i % 4;
    let startX, startY, targetX, targetY;

    // Target position (final position in center area)
    targetX = Math.random() * CANVAS.width;
    targetY = Math.random() * CANVAS.height;

    // Starting position based on side
    switch (side) {
      case 0: // From left
        startX = -100;
        startY = Math.random() * CANVAS.height;
        break;
      case 1: // From right
        startX = CANVAS.width + 100;
        startY = Math.random() * CANVAS.height;
        break;
      case 2: // From top
        startX = Math.random() * CANVAS.width;
        startY = -100;
        break;
      case 3: // From bottom
        startX = Math.random() * CANVAS.width;
        startY = CANVAS.height + 100;
        break;
    }

    return {
      id: i,
      label: skill.name,
      category: skill.category,
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      vx: 0,
      vy: 0,
      radius: skill.size,
      color: COLORS_FOR_CATEGORY[skill.category],
      animationProgress: 0, // 0 to 1
      animationDelay: i * 50, // Stagger animation
      hasReachedTarget: false,
    };
  });

  const CONNECTIONS_SET = [];

  // Configuration variables
  let physicsEnabled = false, // Disabled during animation
    hoveredNode = null,
    isDragging = false,
    draggedNode = null,
    offsetX = 0,
    offsetY = 0,
    animationStartTime = null,
    animationStarted = false;

  // Create connections based on categories and proximity
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      // Connect nodes in same category or randomly
      if (NODES[i].category === NODES[j].category || Math.random() > 0.7) {
        CONNECTIONS_SET.push({ source: i, target: j });
      }
    }
  }

  // Get mouse/touch position
  function getEventPosition(e) {
    const rect = CANVAS.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  // Mouse/Touch move
  function handleMove(e) {
    const pos = getEventPosition(e);

    if (isDragging && draggedNode) {
      draggedNode.x = pos.x - offsetX;
      draggedNode.y = pos.y - offsetY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
      return;
    }

    hoveredNode = null;
    for (let node of NODES) {
      const dx = pos.x - node.x;
      const dy = pos.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < node.radius) {
        hoveredNode = node;
        break;
      }
    }
  }

  // Mouse/Touch start
  function handleStart(e) {
    const pos = getEventPosition(e);

    for (let node of NODES) {
      const dx = pos.x - node.x;
      const dy = pos.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < node.radius) {
        isDragging = true;
        draggedNode = node;
        offsetX = pos.x - node.x;
        offsetY = pos.y - node.y;
        CANVAS.style.cursor = "grabbing";
        e.preventDefault();
        break;
      }
    }
  }

  // Mouse/Touch end
  function handleEnd(e) {
    if (isDragging && draggedNode) {
      // Spring back if out of bounds
      const margin = draggedNode.radius;
      if (
        draggedNode.x < margin ||
        draggedNode.x > CANVAS.width - margin ||
        draggedNode.y < margin ||
        draggedNode.y > CANVAS.height - margin
      ) {
        // Calculate spring back force
        const centerX = CANVAS.width / 2;
        const centerY = CANVAS.height / 2;
        const dx = centerX - draggedNode.x;
        const dy = centerY - draggedNode.y;

        draggedNode.vx = dx * 0.1;
        draggedNode.vy = dy * 0.1;
      }
    }

    isDragging = false;
    draggedNode = null;
    CANVAS.style.cursor = "grab";
  }

  // Mouse events
  CANVAS.addEventListener("mousemove", handleMove);
  CANVAS.addEventListener("mousedown", handleStart);
  CANVAS.addEventListener("mouseup", handleEnd);
  CANVAS.addEventListener("mouseleave", handleEnd);

  // Touch events
  CANVAS.addEventListener("touchmove", handleMove, { passive: false });
  CANVAS.addEventListener("touchstart", handleStart, { passive: false });
  CANVAS.addEventListener("touchend", handleEnd);
  CANVAS.addEventListener("touchcancel", handleEnd);

  // Set canvas size
  function resizeCanvas() {
    CANVAS.width = CANVAS.offsetWidth;
    CANVAS.height = CANVAS.offsetHeight;

    // Update target positions when canvas resizes
    for (let node of NODES) {
      if (!node.hasReachedTarget) {
        node.targetX = Math.random() * CANVAS.width;
        node.targetY = Math.random() * CANVAS.height;
      }
    }
  }

  // Easing function for smooth animation
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateAnimation() {
    const currentTime = Date.now();
    const elapsed = currentTime - animationStartTime;

    let allNodesReached = true;

    for (let node of NODES) {
      if (node.hasReachedTarget) continue;

      // Check if this node should start animating
      if (elapsed < node.animationDelay) {
        allNodesReached = false;
        continue;
      }

      // Calculate animation progress (0 to 1)
      const animationDuration = 1500; // 1.5 seconds
      const nodeElapsed = elapsed - node.animationDelay;
      node.animationProgress = Math.min(nodeElapsed / animationDuration, 1);

      // Apply easing
      const easedProgress = easeOutCubic(node.animationProgress);

      // Calculate start position
      const side = node.id % 4;
      let startX, startY;
      switch (side) {
        case 0:
          startX = -100;
          startY = node.targetY;
          break;
        case 1:
          startX = CANVAS.width + 100;
          startY = node.targetY;
          break;
        case 2:
          startX = node.targetX;
          startY = -100;
          break;
        case 3:
          startX = node.targetX;
          startY = CANVAS.height + 100;
          break;
      }

      // Interpolate position
      node.x = startX + (node.targetX - startX) * easedProgress;
      node.y = startY + (node.targetY - startY) * easedProgress;

      // Check if animation is complete
      if (node.animationProgress >= 1) {
        node.hasReachedTarget = true;
        node.x = node.targetX;
        node.y = node.targetY;
      } else {
        allNodesReached = false;
      }
    }

    // Enable physics once all nodes have reached their targets
    if (allNodesReached && !physicsEnabled) {
      physicsEnabled = true;
      console.log("Animation complete, physics enabled");
    }
  }

  function updatePhysics() {
    if (!physicsEnabled) return;

    for (let node of NODES) {
      // Skip physics for dragged node
      if (node === draggedNode && isDragging) continue;

      // Apply velocity
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off walls with spring back effect
      const margin = node.radius;
      if (node.x < margin) {
        node.x = margin;
        node.vx *= -0.8;
      } else if (node.x > CANVAS.width - margin) {
        node.x = CANVAS.width - margin;
        node.vx *= -0.8;
      }

      if (node.y < margin) {
        node.y = margin;
        node.vy *= -0.8;
      } else if (node.y > CANVAS.height - margin) {
        node.y = CANVAS.height - margin;
        node.vy *= -0.8;
      }

      // Apply friction
      node.vx *= 0.98;
      node.vy *= 0.98;

      // Repulsion from other nodes
      for (let other of NODES) {
        if (node === other) continue;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          node.vx += (dx / dist) * force * 0.5;
          node.vy += (dy / dist) * force * 0.5;
        }
      }

      // Spring forces on connections
      for (let conn of CONNECTIONS_SET) {
        const source = NODES[conn.source];
        const target = NODES[conn.target];

        if (node !== source && node !== target) continue;

        const other = node === source ? target : source;
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idealDist = 150;

        if (dist > 0) {
          const force = ((dist - idealDist) / idealDist) * 0.1;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }
    }
  }

  function draw() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Update animation if not complete
    if (!physicsEnabled) {
      updateAnimation();
    }

    // Draw connections (only for nodes that have appeared)
    CTX.strokeStyle = "rgba(102, 126, 234, 0.2)";
    CTX.lineWidth = 2;

    for (let conn of CONNECTIONS_SET) {
      const source = NODES[conn.source];
      const target = NODES[conn.target];

      // Only draw connection if both nodes have started animating
      if (source.animationProgress > 0 && target.animationProgress > 0) {
        // Fade in connections based on both nodes' progress
        const opacity =
          Math.min(source.animationProgress, target.animationProgress) * 0.2;

        // Highlight connections to hovered node
        if (hoveredNode && (source === hoveredNode || target === hoveredNode)) {
          CTX.strokeStyle = `rgba(102, 126, 234, ${Math.min(
            opacity * 3,
            0.6
          )})`;
          CTX.lineWidth = 3;
        } else {
          CTX.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
          CTX.lineWidth = 2;
        }

        CTX.beginPath();
        CTX.moveTo(source.x, source.y);
        CTX.lineTo(target.x, target.y);
        CTX.stroke();
      }
    }

    // Draw nodes
    for (let node of NODES) {
      // Only draw if animation has started
      if (node.animationProgress === 0) continue;

      const isHovered = node === hoveredNode;
      const isDragged = node === draggedNode && isDragging;

      // Fade in based on animation progress
      const opacity = node.animationProgress;

      // Node shadow
      CTX.shadowColor = `rgba(0, 0, 0, ${0.3 * opacity})`;
      CTX.shadowBlur = isHovered || isDragged ? 20 : 10;
      CTX.shadowOffsetX = 0;
      CTX.shadowOffsetY = 5;

      // Node circle
      CTX.globalAlpha = opacity;
      CTX.fillStyle = node.color;
      CTX.beginPath();
      CTX.arc(
        node.x,
        node.y,
        isHovered || isDragged ? node.radius * 1.2 : node.radius,
        0,
        Math.PI * 2
      );
      CTX.fill();

      // Reset shadow
      CTX.shadowColor = "transparent";
      CTX.shadowBlur = 0;

      // Node label - ALWAYS SHOW
      CTX.fillStyle = "white";
      CTX.font = isHovered || isDragged ? "bold 13px Arial" : "bold 11px Arial";
      CTX.textAlign = "center";
      CTX.textBaseline = "middle";

      // Add text shadow for better readability
      CTX.shadowColor = `rgba(0, 0, 0, ${0.5 * opacity})`;
      CTX.shadowBlur = 4;
      CTX.fillText(node.label, node.x, node.y);

      // Reset shadow and opacity
      CTX.shadowColor = "transparent";
      CTX.shadowBlur = 0;
      CTX.globalAlpha = 1;
    }

    updatePhysics();
    requestAnimationFrame(draw);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // INTERSECTION OBSERVER
  const OBSERVER_FOR_CANVAS = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          animationStartTime = Date.now();
          draw();
          OBSERVER_FOR_CANVAS.disconnect();
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  // Start to observe the canvas element
  OBSERVER_FOR_CANVAS.observe(CANVAS);
})();
