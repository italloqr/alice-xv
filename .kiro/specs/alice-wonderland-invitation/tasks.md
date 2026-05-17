# Implementation Plan: Alice in Wonderland Invitation

## Overview

A cinematic interactive digital invitation built with HTML5, CSS3, and Vanilla JavaScript. Implementation follows an incremental approach: project structure and HTML first, then CSS styling, then JavaScript logic (state machine, GSAP animation, audio), and finally error handling and tests. Each step builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - [x] 1.1 Create directory structure and index.html
    - Create `assets/` directory
    - Move cover.mp4, invitation.mp4, and music.mp3 into `assets/`
    - Create `index.html` with full HTML structure: invitation-screen with video, cover-screen with video and open-button, audio-toggle button, background-music audio element, GSAP CDN script tag, and script.js reference
    - Include proper meta tags (charset, viewport), lang="pt-BR", and link to style.css
    - Ensure all video elements have playsinline attribute for iOS Safari compatibility
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 8.4_

  - [x] 1.2 Create base style.css with reset, layout, and screen containers
    - Set body with overflow: hidden, margin: 0, background: #0b1220
    - Define `.screen` class with position: fixed, top: 0, left: 0, width: 100vw, height: 100vh
    - Style video elements with object-fit: cover, width: 100%, height: 100%
    - Set z-index layers per design: invitation-screen (1), cover-screen (10), open-button (30), audio-toggle (9999)
    - Define `.hidden` utility class (visibility: hidden, pointer-events: none)
    - Define `.no-pointer-events` utility class
    - _Requirements: 2.2, 2.5, 5.3, 8.1, 8.2, 8.8, 9.1_

- [x] 2. Implement visual styling and responsive design
  - [x] 2.1 Style the Open Button with glow and pulse animation
    - Position button centered horizontally in the lower third of the viewport
    - Set text to uppercase with gold/white text-shadow glow
    - Add box-shadow with gold (rgba(212, 175, 55)) and white (rgba(255, 255, 255)) values, spread between 10px and 30px
    - Create CSS @keyframes pulse animation cycling opacity 0.6→1.0 over 2s ease-in-out
    - Ensure minimum tap target of 44×44 CSS pixels
    - _Requirements: 3.1, 3.2, 3.6, 9.2_

  - [x] 2.2 Style the Audio Toggle button
    - Position fixed, top: 16px, right: 16px
    - Circular shape with minimum diameter 44px
    - Set opacity: 0.75, z-index: 9999
    - Initially hidden via `.hidden` class
    - _Requirements: 7.1, 7.6_

  - [x] 2.3 Add split animation layer styles and Center Glow
    - Define `.cover-left` with clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%), position fixed, z-index: 20
    - Define `.cover-right` with clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%), position fixed, z-index: 20
    - Define `.center-glow` with radial-gradient from white (opacity 0.8+) at center to transparent, z-index: 25, spanning at least 50% viewport height
    - _Requirements: 4.2, 4.3, 4.4, 9.3_

  - [x] 2.4 Add responsive breakpoints
    - Mobile (<768px): Open_Button font-size minimum 14px, Audio_Toggle minimum 40×40px
    - Tablet (768px–1024px): Open_Button font-size minimum 16px
    - Desktop (>1024px): Open_Button font-size minimum 18px
    - _Requirements: 8.3, 8.5, 8.6, 8.7_

- [x] 3. Checkpoint - Verify HTML and CSS
  - Ensure all HTML and CSS files are valid and render correctly, ask the user if questions arise.

- [x] 4. Implement JavaScript state machine and core logic
  - [x] 4.1 Create script.js with state management and init()
    - Declare `appState` variable initialized to "cover"
    - Define valid transitions array: [{from:"cover", to:"opening"}, {from:"opening", to:"invitation"}]
    - Implement `transitionState(targetState)` function that validates against valid transitions and rejects invalid ones
    - Implement `init()` function that caches DOM references, registers click listeners on Open_Button and Audio_Toggle, and sets state to "cover"
    - Call `init()` on DOMContentLoaded
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 3.5_

  - [ ]* 4.2 Write property test for state machine transitions
    - **Property 1: State machine transition validity**
    - Generate random (currentState, targetState) pairs from all 9 combinations of states
    - Assert transitions succeed only for valid pairs (cover→opening, opening→invitation)
    - Assert all other transitions leave state unchanged
    - **Validates: Requirements 10.1, 10.4, 10.5, 3.3**

  - [x] 4.3 Implement openInvitation() and button interaction
    - Validate state === "cover" before proceeding; if not, return early with no action
    - Transition state to "opening"
    - Hide Open_Button (add hidden class)
    - Disable pointer-events on cover-screen
    - Pause cover video and reset currentTime to 0
    - Call startMusic() and runOpeningAnimation()
    - _Requirements: 3.3, 3.4, 3.5, 6.3, 10.5_

  - [x] 4.4 Implement audio functions: startMusic(), fadeInAudio(), toggleAudio()
    - `startMusic()`: Load and play music.mp3, set volume to 0, call fadeInAudio(). Catch rejected play() promise gracefully.
    - `fadeInAudio()`: Linearly interpolate volume from 0 to 0.5 over 2000ms using setInterval (e.g., 50ms steps)
    - `toggleAudio()`: If not muted, set volume to 0 and update icon to 🔇. If muted, restore volume to 0.5 and update icon to 🔊.
    - Ensure music is loaded only once regardless of interactions
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 4.5 Write property test for audio fade linear interpolation
    - **Property 2: Audio fade linear interpolation**
    - Generate random integers in [0, 2000] for time values
    - Assert volume at time t equals (t / 2000) * 0.5
    - **Validates: Requirements 6.2**

  - [ ]* 4.6 Write property test for audio toggle round-trip
    - **Property 3: Audio toggle round-trip**
    - Generate random initial muted/unmuted states
    - Assert toggling twice restores original volume (0→0.5→0 or 0.5→0→0.5)
    - **Validates: Requirements 7.4, 7.5**

- [x] 5. Implement GSAP opening animation
  - [x] 5.1 Implement createSplitLayers() and runOpeningAnimation()
    - `createSplitLayers()`: Clone cover video element, create Cover_Left and Cover_Right divs with clipped video, create Center_Glow div with radial-gradient, append all to body
    - `runOpeningAnimation()`: Check if GSAP is available (typeof gsap !== "undefined"). If not, call handleGSAPFallback(). Otherwise create GSAP timeline with:
      - Cover_Left: translateX to -100% over 3s with power4.inOut
      - Cover_Right: translateX to 100% over 3s with power4.inOut
      - Center_Glow: fade in 0→1 over 0.5s, fade out 1→0 in final 0.5s
      - Invitation_Screen: opacity 0→1 over 1.5s starting at time 0
      - onComplete: call onAnimationComplete()
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.3, 9.4_

  - [x] 5.2 Implement onAnimationComplete() and handleGSAPFallback()
    - `onAnimationComplete()`: Remove Cover_Left, Cover_Right, Center_Glow from DOM. Transition state to "invitation". Show Audio_Toggle. Play invitation video unmuted. Re-enable pointer events.
    - `handleGSAPFallback()`: Set invitation-screen opacity to 1 immediately. Transition state to "invitation". Show Audio_Toggle. Play invitation video unmuted.
    - _Requirements: 4.7, 4.8, 4.9, 5.1, 5.2, 5.6, 7.1, 7.7, 10.6_

- [ ] 6. Checkpoint - Verify core functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement error handling and graceful degradation
  - [x] 7.1 Add media error handlers and GSAP fallback
    - Add `error` event listeners on cover-video, invitation-video, and background-music elements
    - On cover.mp4 error: ensure dark blue fallback is visible, button remains functional
    - On invitation.mp4 error: display dark blue fallback, state remains "invitation"
    - On music.mp3 error: continue without audio, hide audio toggle
    - Wrap GSAP timeline creation in try/catch; on error call handleGSAPFallback()
    - Handle browser autoplay restrictions: catch rejected play() promises, continue silently
    - _Requirements: 4.9, 5.5, 6.6, 9.1_

- [x] 8. Integration and final wiring
  - [x] 8.1 Wire all components together and verify end-to-end flow
    - Ensure init() is called on DOMContentLoaded and all event listeners are properly registered
    - Verify the complete flow: page load → cover state → click → opening animation → invitation state
    - Confirm invitation video plays unmuted concurrently with background music
    - Confirm audio toggle works in both "opening" and "invitation" states
    - Verify invitation screen remains visible indefinitely without timeout
    - _Requirements: 5.4, 5.6, 6.5, 7.7_

  - [ ]* 8.2 Write unit tests for DOM structure and error handling
    - Test video elements have correct attributes (autoplay, muted, loop, playsinline)
    - Test init() sets state to "cover" and registers listeners
    - Test GSAP fallback path when gsap is undefined
    - Test audio error handling continues without interruption
    - _Requirements: 2.1, 4.9, 6.6, 10.3_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests use Vitest framework as specified in the design
- Assets (cover.mp4, invitation.mp4, music.mp3) must be present in the assets/ directory
- GSAP is loaded via CDN — no npm install required for the main application
- All code is vanilla JavaScript (ES6+) with no build step

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 5, "tasks": ["4.5", "4.6", "5.1"] },
    { "id": 6, "tasks": ["5.2"] },
    { "id": 7, "tasks": ["7.1"] },
    { "id": 8, "tasks": ["8.1"] },
    { "id": 9, "tasks": ["8.2"] }
  ]
}
```
