// ============================================================
// Alice XV - Interactive Invitation
// State Machine & Core Logic
// ============================================================

// --- State Management ---

let appState = "cover";

const validTransitions = [
  { from: "cover", to: "opening" },
  { from: "opening", to: "invitation" }
];

/**
 * Attempts to transition the application to the target state.
 * Only succeeds if the transition is valid (cover→opening or opening→invitation).
 * Returns true if transition succeeded, false otherwise.
 */
function transitionState(targetState) {
  const isValid = validTransitions.some(
    (t) => t.from === appState && t.to === targetState
  );

  if (!isValid) {
    return false;
  }

  appState = targetState;
  return true;
}

// --- DOM References ---

let elements = {};

// --- Audio State ---

let musicStarted = false;
let isMuted = false;

// --- Initialization ---

/**
 * Caches DOM element references, registers event listeners,
 * and sets the initial application state to "cover".
 */
function init() {
  elements = {
    coverScreen: document.getElementById("cover-screen"),
    coverVideo: document.getElementById("cover-video"),
    invitationScreen: document.getElementById("invitation-screen"),
    invitationVideo: document.getElementById("invitation-video"),
    openButton: document.getElementById("open-button"),
    audioToggle: document.getElementById("audio-toggle"),
    backgroundMusic: document.getElementById("background-music")
  };

  // Register click listeners
  elements.openButton.addEventListener("click", openInvitation);
  elements.audioToggle.addEventListener("click", toggleAudio);

  // Register media error handlers
  elements.coverVideo.addEventListener("error", handleCoverVideoError);
  elements.invitationVideo.addEventListener("error", handleInvitationVideoError);
  elements.backgroundMusic.addEventListener("error", handleMusicError);

  // Set initial state
  appState = "cover";
}

// --- Public Functions (to be implemented in later tasks) ---

// Triggers the cover→opening transition and starts the animation sequence
function openInvitation() {
  if (appState !== "cover") {
    return;
  }

  if (!transitionState("opening")) {
    return;
  }

  elements.openButton.classList.add("hidden");
  elements.coverScreen.classList.add("no-pointer-events");

  elements.coverVideo.pause();
  elements.coverVideo.currentTime = 0;

  // Show audio toggle when entering "opening" state (Req 7.7)
  elements.audioToggle.classList.remove("hidden");

  // Start invitation video immediately so it's playing when revealed
  elements.invitationVideo.muted = false;
  elements.invitationVideo.play().catch((err) => {
    console.warn("Invitation video playback was prevented:", err);
  });

  startMusic();
  runOpeningAnimation();
}

// Loads and begins background music playback
function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  elements.backgroundMusic.volume = 0;
  elements.backgroundMusic.play().catch((err) => {
    console.warn("Audio playback was prevented:", err);
  });
  fadeInAudio();
}

// Fades music volume from 0 to 0.5 over 2 seconds
function fadeInAudio() {
  const targetVolume = 0.5;
  const duration = 2000;
  const stepInterval = 50;
  const increment = targetVolume / (duration / stepInterval);

  const fadeInterval = setInterval(() => {
    const newVolume = elements.backgroundMusic.volume + increment;
    if (newVolume >= targetVolume) {
      elements.backgroundMusic.volume = targetVolume;
      clearInterval(fadeInterval);
    } else {
      elements.backgroundMusic.volume = newVolume;
    }
  }, stepInterval);
}

// Toggles background music mute/unmute
function toggleAudio() {
  if (!isMuted) {
    elements.backgroundMusic.volume = 0;
    isMuted = true;
    elements.audioToggle.textContent = "🔇";
  } else {
    elements.backgroundMusic.volume = 0.5;
    isMuted = false;
    elements.audioToggle.textContent = "🔊";
  }
}

// --- Internal Functions (to be implemented in later tasks) ---

// Clones cover video into left/right halves for split animation
function createSplitLayers() {
  // Clone cover video for left half
  const videoLeft = elements.coverVideo.cloneNode(true);
  videoLeft.removeAttribute("id");
  videoLeft.muted = true;

  // Clone cover video for right half
  const videoRight = elements.coverVideo.cloneNode(true);
  videoRight.removeAttribute("id");
  videoRight.muted = true;

  // Create Cover_Left div
  const coverLeft = document.createElement("div");
  coverLeft.classList.add("cover-left");
  coverLeft.appendChild(videoLeft);

  // Create Cover_Right div
  const coverRight = document.createElement("div");
  coverRight.classList.add("cover-right");
  coverRight.appendChild(videoRight);

  // Create Center_Glow div
  const centerGlow = document.createElement("div");
  centerGlow.classList.add("center-glow");
  centerGlow.style.opacity = "0";

  // Append all to body
  document.body.appendChild(coverLeft);
  document.body.appendChild(coverRight);
  document.body.appendChild(centerGlow);

  return { coverLeft, coverRight, centerGlow };
}

// Executes the GSAP timeline animation
function runOpeningAnimation() {
  // Check if GSAP is available
  if (typeof gsap === "undefined") {
    handleGSAPFallback();
    return;
  }

  try {
    // Create split layers
    const { coverLeft, coverRight, centerGlow } = createSplitLayers();

    // Hide the original cover screen immediately — the split layers now cover it
    elements.coverScreen.style.display = "none";

    // Ensure invitation screen is fully visible underneath the splits
    elements.invitationScreen.style.opacity = "1";

    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: onAnimationComplete
    });

    // Cover_Left: translateX to -100% over 3s with power4.inOut
    tl.to(coverLeft, {
      x: "-100%",
      duration: 3,
      ease: "power4.inOut"
    }, 0);

    // Cover_Right: translateX to 100% over 3s with power4.inOut
    tl.to(coverRight, {
      x: "100%",
      duration: 3,
      ease: "power4.inOut"
    }, 0);

    // Center_Glow: fade in 0→1 over 0.5s
    tl.to(centerGlow, {
      opacity: 1,
      duration: 0.5,
      ease: "power4.inOut"
    }, 0);

    // Center_Glow: fade out 1→0 in final 0.5s (starts at 2.5s)
    tl.to(centerGlow, {
      opacity: 0,
      duration: 0.5,
      ease: "power4.inOut"
    }, 2.5);
  } catch (err) {
    console.warn("GSAP animation error:", err);
    handleGSAPFallback();
  }
}

// Cleans up animation layers and transitions to invitation state
function onAnimationComplete() {
  // Remove Cover_Left, Cover_Right, Center_Glow from DOM
  const coverLeft = document.querySelector(".cover-left");
  const coverRight = document.querySelector(".cover-right");
  const centerGlow = document.querySelector(".center-glow");

  if (coverLeft) coverLeft.remove();
  if (coverRight) coverRight.remove();
  if (centerGlow) centerGlow.remove();

  // Hide the original cover screen so invitation is visible
  elements.coverScreen.classList.add("hidden");

  // Transition state to "invitation"
  transitionState("invitation");

  // Show Audio_Toggle
  elements.audioToggle.classList.remove("hidden");

  // Play invitation video unmuted
  elements.invitationVideo.muted = false;
  elements.invitationVideo.play().catch((err) => {
    console.warn("Invitation video playback was prevented:", err);
  });

  // Re-enable pointer events on cover screen
  elements.coverScreen.classList.remove("no-pointer-events");
}

// Fallback when GSAP is unavailable - skips animation
function handleGSAPFallback() {
  // Set invitation screen to full opacity immediately
  elements.invitationScreen.style.opacity = "1";

  // Hide the original cover screen so invitation is visible
  elements.coverScreen.classList.add("hidden");

  // Transition state to "invitation"
  transitionState("invitation");

  // Show Audio_Toggle
  elements.audioToggle.classList.remove("hidden");

  // Play invitation video unmuted
  elements.invitationVideo.muted = false;
  elements.invitationVideo.play().catch((err) => {
    console.warn("Invitation video playback was prevented:", err);
  });
}

// --- Media Error Handlers ---

/**
 * Handles cover video load/playback error.
 * Dark blue fallback (#0b1220) is already visible as body background.
 * Ensures the open button remains functional.
 */
function handleCoverVideoError() {
  console.warn("Cover video failed to load. Fallback background is visible.");
  // Button remains functional — no additional action needed since
  // the dark blue body background is already the fallback.
}

/**
 * Handles invitation video load/playback error.
 * Dark blue fallback is visible, state remains "invitation".
 */
function handleInvitationVideoError() {
  console.warn("Invitation video failed to load. Fallback background is visible.");
  // Dark blue body background serves as fallback.
  // State remains "invitation" — no state change needed.
}

/**
 * Handles background music load/playback error.
 * Continues without audio and hides the audio toggle.
 */
function handleMusicError() {
  console.warn("Background music failed to load. Continuing without audio.");
  if (elements.audioToggle) {
    elements.audioToggle.classList.add("hidden");
  }
}

// --- Bootstrap ---

document.addEventListener("DOMContentLoaded", init);
