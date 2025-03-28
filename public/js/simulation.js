// DOM Elements
const rainContainer = document.getElementById("rain-container")
const soil = document.getElementById("soil")
const cropsContainer = document.getElementById("crops-container")
const rainToggle = document.getElementById("rain-toggle")
const controlsToggle = document.getElementById("controls-toggle")
const controlPanel = document.getElementById("control-panel")
const autoIrrigationToggle = document.getElementById("auto-irrigation")
const moistureThreshold = document.getElementById("moisture-threshold")
const thresholdValue = document.getElementById("threshold-value")
const irrigationStatus = document.getElementById("irrigation-status")
const moistureDisplay = document.getElementById("moisture")
const temperatureDisplay = document.getElementById("temperature")
const irrigationActive = document.getElementById("irrigation-active")
const irrigationTimeCard = document.getElementById("irrigation-time-card")
const irrigationTimeDisplay = document.getElementById("irrigation-time")

// State
const state = {
  isRaining: false,
  autoIrrigation: true,
  soilMoisture: 50,
  temperature: 24,
  moistureThreshold: 40,
  irrigationActive: false,
  irrigationTime: 0,
  irrigationStartTime: null,
}

// Initialize
function init() {
  createCrops()
  updateSoilAppearance()
  setupEventListeners()
  startSimulation()
}

// Create crops
function createCrops() {
  // First row
  const row1 = document.createElement("div")
  row1.className = "crop-row"
  row1.style.display = "flex"
  row1.style.justifyContent = "space-around"
  row1.style.width = "100%"
  row1.style.position = "absolute"
  row1.style.bottom = "0"

  for (let i = 0; i < 8; i++) {
    const crop = createCrop(60)
    row1.appendChild(crop)
  }

  cropsContainer.appendChild(row1)

  // Second row
  const row2 = document.createElement("div")
  row2.className = "crop-row"
  row2.style.display = "flex"
  row2.style.justifyContent = "space-around"
  row2.style.width = "100%"
  row2.style.position = "absolute"
  row2.style.bottom = "0"
  row2.style.left = "5%"

  for (let i = 0; i < 7; i++) {
    const crop = createCrop(75)
    row2.appendChild(crop)
  }

  cropsContainer.appendChild(row2)
}

// Create a single crop
function createCrop(height) {
  const crop = document.createElement("div")
  crop.className = "crop"

  const plant = document.createElement("div")
  plant.className = "plant"

  const stem = document.createElement("div")
  stem.className = "plant-stem"
  stem.style.height = `${height}px`

  const leaves = document.createElement("div")
  leaves.className = "plant-leaves"

  const leaf1 = document.createElement("div")
  leaf1.className = "leaf leaf-1"

  const leaf2 = document.createElement("div")
  leaf2.className = "leaf leaf-2"

  const leaf3 = document.createElement("div")
  leaf3.className = "leaf leaf-3"

  const leaf4 = document.createElement("div")
  leaf4.className = "leaf leaf-4"

  leaves.appendChild(leaf1)
  leaves.appendChild(leaf2)
  leaves.appendChild(leaf3)
  leaves.appendChild(leaf4)

  plant.appendChild(stem)
  plant.appendChild(leaves)

  const sprinkler = document.createElement("div")
  sprinkler.className = "sprinkler"

  const sprinklerBase = document.createElement("div")
  sprinklerBase.className = "sprinkler-base"

  const sprinklerHead = document.createElement("div")
  sprinklerHead.className = "sprinkler-head"

  const waterSpray = document.createElement("div")
  waterSpray.className = "water-spray"

  sprinkler.appendChild(sprinklerBase)
  sprinkler.appendChild(sprinklerHead)
  sprinkler.appendChild(waterSpray)

  crop.appendChild(plant)
  crop.appendChild(sprinkler)

  return crop
}

// Setup event listeners
function setupEventListeners() {
  rainToggle.addEventListener("click", toggleRain)
  controlsToggle.addEventListener("click", toggleControlPanel)
  autoIrrigationToggle.addEventListener("change", toggleAutoIrrigation)
  moistureThreshold.addEventListener("input", updateMoistureThreshold)
}

// Toggle rain
function toggleRain() {
  state.isRaining = !state.isRaining
  rainToggle.textContent = state.isRaining ? "Stop Rain" : "Start Rain"

  if (state.isRaining) {
    createRaindrops()
    rainContainer.classList.remove("hidden")
  } else {
    rainContainer.classList.add("hidden")
    rainContainer.innerHTML = ""
  }

  updatePlantAnimation()
}

// Create raindrops
function createRaindrops() {
  rainContainer.innerHTML = ""

  for (let i = 0; i < 100; i++) {
    const raindrop = document.createElement("div")
    raindrop.className = "raindrop"

    const delay = Math.random() * 2
    const duration = 0.5 + Math.random() * 0.5
    const leftPos = Math.random() * 100

    raindrop.style.left = `${leftPos}%`
    raindrop.style.animationDelay = `${delay}s`
    raindrop.style.animation = `fall ${duration}s linear ${delay}s infinite`

    // Create keyframes for falling animation
    const keyframes = `
      @keyframes fall {
        from {
          transform: translateY(-20px);
        }
        to {
          transform: translateY(100vh);
        }
      }
    `

    // Add keyframes to document if they don't exist
    if (!document.querySelector(`style[data-animation="fall"]`)) {
      const style = document.createElement("style")
      style.setAttribute("data-animation", "fall")
      style.textContent = keyframes
      document.head.appendChild(style)
    }

    rainContainer.appendChild(raindrop)
  }
}

// Toggle control panel
function toggleControlPanel() {
  controlPanel.classList.toggle("hidden")
  controlPanel.classList.toggle("visible")
  controlsToggle.textContent = controlPanel.classList.contains("hidden") ? "Smart Controls" : "Hide Controls"
}

// Toggle auto irrigation
function toggleAutoIrrigation() {
  state.autoIrrigation = autoIrrigationToggle.checked
  updateIrrigationStatus()
}

// Update moisture threshold
function updateMoistureThreshold() {
  state.moistureThreshold = Number.parseInt(moistureThreshold.value)
  thresholdValue.textContent = `${state.moistureThreshold}%`
  updateIrrigationStatus()
}

// Update irrigation status text
function updateIrrigationStatus() {
  irrigationStatus.textContent = state.autoIrrigation
    ? `System will automatically irrigate when soil moisture falls below ${state.moistureThreshold}%`
    : "Manual irrigation mode enabled"
}

// Start simulation
function startSimulation() {
  // Update moisture based on rain
  setInterval(() => {
    if (state.isRaining) {
      state.soilMoisture = Math.min(state.soilMoisture + 0.5, 100)
    } else {
      state.soilMoisture = Math.max(state.soilMoisture - 0.2, 0)
    }

    // Check if irrigation should be activated
    checkIrrigation()

    // Update UI
    updateUI()
  }, 500)

  // Simulate temperature changes
  setInterval(() => {
    // Small random temperature fluctuations
    state.temperature += (Math.random() - 0.5) * 0.2
    state.temperature = Math.round(state.temperature * 10) / 10
    temperatureDisplay.textContent = `${state.temperature.toFixed(1)}°C`
  }, 5000)
}

// Check if irrigation should be activated
function checkIrrigation() {
  const shouldIrrigate = state.autoIrrigation && state.soilMoisture < state.moistureThreshold && !state.isRaining

  if (shouldIrrigate && !state.irrigationActive) {
    // Start irrigation
    state.irrigationActive = true
    state.irrigationStartTime = new Date()
    activateIrrigation(true)
    irrigationActive.classList.remove("hidden")
    irrigationTimeCard.classList.remove("hidden")
  } else if ((!shouldIrrigate && state.irrigationActive) || state.isRaining) {
    // Stop irrigation
    state.irrigationActive = false
    activateIrrigation(false)
    irrigationActive.classList.add("hidden")

    // Keep showing the irrigation time
    if (state.irrigationTime > 0) {
      irrigationTimeCard.classList.remove("hidden")
    }
  }

  // Update irrigation time if active
  if (state.irrigationActive) {
    const currentTime = new Date()
    const elapsedMinutes = Math.floor((currentTime - state.irrigationStartTime) / 60000)
    state.irrigationTime = elapsedMinutes
    irrigationTimeDisplay.textContent = `Irrigation: ${state.irrigationTime} min`
  }
}

// Activate or deactivate irrigation
function activateIrrigation(activate) {
  const sprinklers = document.querySelectorAll(".sprinkler")

  sprinklers.forEach((sprinkler) => {
    const waterSpray = sprinkler.querySelector(".water-spray")

    if (activate) {
      // Clear existing water particles
      waterSpray.innerHTML = ""

      // Create water particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div")
        particle.className = "water-particle"

        // Calculate spray direction
        const angle = i * 45 * (Math.PI / 180)
        const distance = 20 + Math.random() * 10
        const xPos = Math.cos(angle) * distance
        const yPos = Math.sin(angle) * distance * -1 // Negative to go upward

        particle.style.setProperty("--x", `${xPos}px`)
        particle.style.setProperty("--y", `${yPos}px`)

        // Set animation
        particle.style.animation = `water-spray 1s ease-out ${i * 0.1}s infinite`

        waterSpray.appendChild(particle)
      }
    } else {
      // Remove water particles
      waterSpray.innerHTML = ""
    }
  })
}

// Update UI elements
function updateUI() {
  // Update soil moisture display
  moistureDisplay.textContent = `Moisture: ${Math.floor(state.soilMoisture)}%`

  // Update soil appearance based on moisture
  updateSoilAppearance()
}

// Update soil appearance based on moisture level
function updateSoilAppearance() {
  const dryColor = "#9e7e5a"
  const wetColor = "#7c5e3c"

  soil.style.background = `linear-gradient(to top, 
    ${state.soilMoisture > 80 ? wetColor : "#8b6d4c"} ${state.soilMoisture}%, 
    ${state.soilMoisture > 80 ? "#8b6d4c" : dryColor} 100%)`
}

// Update plant animation based on rain
function updatePlantAnimation() {
  const plants = document.querySelectorAll(".plant")

  plants.forEach((plant) => {
    if (state.isRaining) {
      plant.style.animation = "plant-sway-rain 3s ease-in-out infinite"
    } else {
      plant.style.animation = "plant-sway 5s ease-in-out infinite"
    }
  })
}

// Initialize the application
document.addEventListener("DOMContentLoaded", init)

