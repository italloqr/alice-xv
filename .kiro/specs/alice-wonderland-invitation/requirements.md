# Requirements Document

## Introduction

A premium interactive digital invitation website for a 15th birthday party themed "Alice in Wonderland." The site presents a cinematic experience where visitors click to "open" the invitation, triggering a magical split-screen animation with audio, revealing the full invitation video underneath. Built exclusively with HTML5, CSS3, and Vanilla JavaScript (ES6+), using GSAP via CDN for the opening animation.

## Glossary

- **Cover_Screen**: The initial full-viewport overlay displaying the cover video and the call-to-action button
- **Invitation_Screen**: The underlying full-viewport layer displaying the invitation video, revealed after the opening animation
- **Opening_Animation**: A GSAP-powered cinematic animation that splits the cover into two halves and slides them apart to reveal the invitation
- **Cover_Left**: The left half of the duplicated cover video layer, clipped via CSS clip-path
- **Cover_Right**: The right half of the duplicated cover video layer, clipped via CSS clip-path
- **Center_Glow**: A radial-gradient element simulating a bright magical light at the vertical center seam during the opening animation
- **Open_Button**: The centered call-to-action element displaying "Clique para abrir" with a glowing pulsing style
- **Audio_Toggle**: A floating circular button in the top-right corner for muting/unmuting the background music
- **Application_State**: One of three discrete states the application can be in: "cover", "opening", or "invitation"
- **GSAP**: GreenSock Animation Platform, loaded via CDN for timeline-based animations

## Requirements

### Requirement 1: Technology Constraints

**User Story:** As a developer, I want the project to use only vanilla web technologies, so that it remains dependency-free and easy to deploy as static files.

#### Acceptance Criteria

1. THE Application SHALL use only HTML5, CSS3, and Vanilla JavaScript (ES6+) without any framework or build tool dependencies
2. THE Application SHALL consist of exactly three source files: index.html, style.css, and script.js
3. THE Application SHALL reference asset files from an assets/ directory containing cover.mp4, invitation.mp4, and music.mp3
4. THE Application SHALL load GSAP exclusively from the CDN URL https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js

### Requirement 2: Cover Screen Display

**User Story:** As a visitor, I want to see an elegant full-screen cover video when I first load the page, so that I am immediately immersed in the Alice in Wonderland theme.

#### Acceptance Criteria

1. WHEN the page loads, THE Cover_Screen SHALL display cover.mp4 as a full-viewport video with autoplay, muted, loop, and playsinline attributes
2. WHEN the page loads, THE Cover_Screen SHALL render the video using object-fit: cover to fill the entire viewport without distortion
3. WHEN the page loads, THE Application SHALL set the Application_State to "cover"
4. WHILE the Application_State is "cover", THE Cover_Screen SHALL be the only visible content layer
5. THE Cover_Screen SHALL use a dark blue (#0b1220) background color as a fallback while the video loads

### Requirement 3: Call-to-Action Button

**User Story:** As a visitor, I want to see a clear, elegant prompt to open the invitation, so that I know how to interact with the page.

#### Acceptance Criteria

1. WHILE the Application_State is "cover", THE Open_Button SHALL display the text "Clique para abrir" in uppercase, horizontally centered and positioned in the lower third of the viewport, with a gold/white text-shadow glow effect
2. WHILE the Application_State is "cover", THE Open_Button SHALL play a continuous CSS pulsing animation that cycles opacity between 0.6 and 1.0 over a 2-second duration using ease-in-out timing
3. WHEN the Open_Button is clicked, THE Application SHALL transition the Application_State from "cover" to "opening"
4. WHEN the Application_State transitions to "opening", THE Open_Button SHALL immediately become hidden (visibility: hidden and pointer-events: none) so it is no longer visible or interactive
5. WHILE the Application_State is "opening", THE Application SHALL disable pointer events on the Cover_Screen container to prevent multiple trigger clicks
6. THE Open_Button SHALL have a minimum tap target size of 44×44 CSS pixels to ensure touch accessibility on mobile devices

### Requirement 4: Opening Animation

**User Story:** As a visitor, I want to see a cinematic animation of the invitation opening from the center, so that the experience feels magical and premium.

#### Acceptance Criteria

1. WHEN the Application_State transitions to "opening", THE Application SHALL duplicate the cover video into Cover_Left and Cover_Right layers using CSS clip-path
2. WHEN the Opening_Animation starts, THE Cover_Left SHALL use clip-path polygon(0 0, 50% 0, 50% 100%, 0 100%) and animate translating horizontally to -100% of the viewport width over the animation duration
3. WHEN the Opening_Animation starts, THE Cover_Right SHALL use clip-path polygon(50% 0, 100% 0, 100% 100%, 50% 100%) and animate translating horizontally to 100% of the viewport width over the animation duration
4. WHEN the Opening_Animation starts, THE Center_Glow SHALL appear at the vertical center seam with a radial-gradient, fading in within the first 0.5 seconds and fading out during the final 0.5 seconds of the animation
5. THE Opening_Animation SHALL complete in exactly 3 seconds total duration using GSAP power4.inOut easing, with Cover_Left, Cover_Right, and Center_Glow animating in parallel on a single GSAP timeline
6. WHEN the Opening_Animation starts, THE Invitation_Screen SHALL fade in from opacity 0 to opacity 1 over 1.5 seconds, beginning at the start of the animation
7. WHEN the Opening_Animation completes, THE Application SHALL remove the Cover_Left, Cover_Right, and Center_Glow elements from the DOM
8. WHEN the Opening_Animation completes, THE Application SHALL transition the Application_State to "invitation"
9. IF GSAP fails to load or the animation cannot be initialized, THEN THE Application SHALL skip the animation and immediately transition the Application_State to "invitation" while making the Invitation_Screen visible at full opacity

### Requirement 5: Invitation Screen Display

**User Story:** As a visitor, I want to see the full invitation video playing after the opening animation, so that I can enjoy the birthday invitation content.

#### Acceptance Criteria

1. WHEN the Application_State transitions to "invitation", THE Invitation_Screen SHALL display invitation.mp4 as a full-viewport video with autoplay, loop, and playsinline attributes
2. WHILE the Application_State is "invitation", THE Invitation_Screen SHALL render the video unmuted so that the video's own audio track is audible
3. THE Invitation_Screen SHALL render the video using object-fit: cover to fill the entire viewport without distortion
4. WHILE the Application_State is "invitation", THE Invitation_Screen SHALL remain visible indefinitely without any timeout or auto-hide behavior
5. IF the invitation.mp4 file fails to load or play, THEN THE Invitation_Screen SHALL display the dark blue (#0b1220) fallback background and the Application_State SHALL remain "invitation"
6. WHEN the Application_State transitions to "invitation", THE Invitation_Screen SHALL play the video's audio concurrently with the background music (music.mp3) without stopping either audio source

### Requirement 6: Audio Playback

**User Story:** As a visitor, I want background music to start playing when I open the invitation, so that the experience is immersive and atmospheric.

#### Acceptance Criteria

1. WHEN the Open_Button is clicked, THE Application SHALL load and start playing music.mp3 as background audio
2. WHEN music playback begins, THE Application SHALL set the initial volume to 0 and linearly fade it to 0.5 over 2 seconds
3. WHEN the Application_State transitions to "opening", THE Application SHALL pause the cover video and reset its playback position to the beginning
4. THE Application SHALL load the music file only once regardless of user interactions
5. WHILE the Application_State is "invitation", THE Application SHALL continue playing background music simultaneously with the invitation video audio
6. IF music.mp3 fails to load or play, THEN THE Application SHALL continue the opening animation and invitation display without audio interruption

### Requirement 7: Audio Toggle Control

**User Story:** As a visitor, I want to be able to mute or unmute the background music, so that I have control over the audio experience.

#### Acceptance Criteria

1. WHEN the Application_State transitions from "cover" to "opening", THE Audio_Toggle SHALL become visible positioned 16px from the top and 16px from the right of the viewport
2. WHILE audio is playing, THE Audio_Toggle SHALL display the 🔊 icon
3. WHILE audio is muted, THE Audio_Toggle SHALL display the 🔇 icon
4. WHEN the Audio_Toggle is clicked while audio is playing, THE Application SHALL mute the music by setting the volume to 0
5. WHEN the Audio_Toggle is clicked while audio is muted, THE Application SHALL unmute the music by restoring the volume to 0.5
6. THE Audio_Toggle SHALL be styled as a circular fixed-position button with a minimum diameter of 44px, an opacity of 0.75, and a z-index of 9999
7. WHILE the Application_State is "opening" or "invitation", THE Audio_Toggle SHALL remain visible and interactive

### Requirement 8: Responsive Design

**User Story:** As a visitor on any device, I want the invitation to display correctly on mobile, tablet, and desktop, so that the experience is consistent regardless of screen size.

#### Acceptance Criteria

1. THE Application SHALL render all video elements at 100vw width and 100vh height with object-fit: cover
2. THE Application SHALL use fixed-position containers for both Cover_Screen and Invitation_Screen to prevent scrolling
3. THE Open_Button SHALL have a minimum tap target size of 44×44 CSS pixels on all viewports
4. THE Application SHALL include the playsinline attribute on all video elements for iOS Safari compatibility
5. WHILE the viewport width is less than 768px, THE Application SHALL render the Open_Button text at a minimum font size of 14px and the Audio_Toggle at a minimum size of 40×40 CSS pixels
6. WHILE the viewport width is between 768px and 1024px, THE Application SHALL render the Open_Button text at a minimum font size of 16px
7. WHILE the viewport width is greater than 1024px, THE Application SHALL render the Open_Button text at a minimum font size of 18px
8. THE Application SHALL set overflow to hidden on the document body to prevent horizontal or vertical scrollbars on all viewports

### Requirement 9: Visual Theme

**User Story:** As a visitor, I want the visual design to evoke an elegant and magical Alice in Wonderland atmosphere, so that the invitation feels premium and thematic.

#### Acceptance Criteria

1. THE Application SHALL use a dark blue (#0b1220) color as the base background fallback
2. THE Open_Button SHALL feature a glow effect using a box-shadow with gold (rgba(212, 175, 55)) and white (rgba(255, 255, 255)) color values, with a combined spread no less than 10px and no greater than 30px
3. WHILE the Opening_Animation is active, THE Center_Glow SHALL display a radial-gradient transitioning from white (opacity 0.8 or higher) at the center to transparent at the edges, spanning at least 50% of the viewport height
4. THE Application SHALL use opacity transitions with a duration between 0.3 seconds and 1.5 seconds for all visibility changes between screens
5. THE Application SHALL apply a consistent color palette limited to dark blue (#0b1220), gold (rgba(212, 175, 55)), and white (#ffffff) for all decorative and thematic UI elements

### Requirement 10: State Management

**User Story:** As a developer, I want clear application state management, so that transitions between screens are predictable and bug-free.

#### Acceptance Criteria

1. THE Application SHALL maintain exactly three discrete states: "cover", "opening", and "invitation" with only two valid transitions: "cover" to "opening", and "opening" to "invitation"
2. THE Application SHALL expose the following functions: init(), openInvitation(), startMusic(), fadeInAudio(), and toggleAudio()
3. WHEN the Application initializes, THE init() function SHALL register click event listeners on the Open_Button and Audio_Toggle, and set the Application_State to "cover"
4. IF any operation attempts a state transition that is not "cover" to "opening" or "opening" to "invitation", THEN THE Application SHALL reject the transition and retain the current Application_State unchanged
5. IF the user clicks the Open_Button while the Application_State is not "cover", THEN THE Application SHALL perform no state change and produce no visual response
6. WHEN the Opening_Animation completes, THE Application SHALL transition the Application_State from "opening" to "invitation" and re-enable pointer events on the document
