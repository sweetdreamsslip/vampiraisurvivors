// Volume Control System for Vampiraí Survivors
// Handles volume control functionality and UI interactions

class VolumeControl {
    constructor() {
        this.currentVolume = 0.5; // Default volume (50%)
        this.isMuted = false;
        this.backgroundMusic = null;
        this.volumeContainer = null;
        this.volumeSlider = null;
        this.volumeDisplay = null;
        this.muteButton = null;
        this.volumeIcon = null;
        this.volumeCompact = null;
        this.volumeExpanded = null;
        this.isInitialized = false;
        this.isExpanded = false;
        this.collapseTimer = null;
        this.collapseDelay = 1000; // 1 second
    }

    // Initialize the volume control system
    init(backgroundMusicAudio) {
        this.backgroundMusic = backgroundMusicAudio;
        this.volumeContainer = document.getElementById('volumeControlContainer');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeDisplay = document.getElementById('volumeDisplay');
        this.muteButton = document.getElementById('muteButton');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumeCompact = this.volumeContainer?.querySelector('.volume-compact');
        this.volumeExpanded = this.volumeContainer?.querySelector('.volume-expanded');
        
        if (!this.volumeContainer || !this.volumeSlider || !this.volumeDisplay || !this.muteButton || !this.volumeIcon) {
            console.error('Volume control elements not found in HTML');
            return false;
        }

        this.setupEventListeners();
        this.isInitialized = true;
        return true;
    }

    // Set up all event listeners for volume control
    setupEventListeners() {
        // Volume slider change
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Mute button click
        this.muteButton.addEventListener('click', () => {
            this.toggleMute();
        });

        // Volume icon click (toggle mute)
        this.volumeIcon.addEventListener('click', () => {
            this.toggleMute();
        });

        // Hover events for expand/collapse behavior
        this.volumeContainer.addEventListener('mouseenter', () => {
            this.expandVolumeControl();
        });

        this.volumeContainer.addEventListener('mouseleave', () => {
            this.startCollapseTimer();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.increaseVolume();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.decreaseVolume();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.toggleMute();
                        break;
                }
            }
        });
    }

    // Show the volume control
    show() {
        if (this.volumeContainer) {
            this.volumeContainer.style.display = 'block';
            this.volumeContainer.classList.add('volume-control-visible');
        }
    }

    // Hide the volume control
    hide() {
        if (this.volumeContainer) {
            this.volumeContainer.style.display = 'none';
            this.volumeContainer.classList.remove('volume-control-visible');
        }
    }

    // Expand the volume control to show full controls
    expandVolumeControl() {
        if (!this.isInitialized) return;
        
        // Clear any existing collapse timer
        this.clearCollapseTimer();
        
        if (!this.isExpanded) {
            this.isExpanded = true;
            this.volumeContainer.classList.add('volume-expanded-state');
        }
    }

    // Start the collapse timer
    startCollapseTimer() {
        if (!this.isInitialized) return;
        
        this.clearCollapseTimer();
        this.collapseTimer = setTimeout(() => {
            this.collapseVolumeControl();
        }, this.collapseDelay);
    }

    // Clear the collapse timer
    clearCollapseTimer() {
        if (this.collapseTimer) {
            clearTimeout(this.collapseTimer);
            this.collapseTimer = null;
        }
    }

    // Collapse the volume control to show only icon
    collapseVolumeControl() {
        if (!this.isInitialized) return;
        
        this.isExpanded = false;
        this.volumeContainer.classList.remove('volume-expanded-state');
    }

    // Set volume (0.0 to 1.0)
    setVolume(volume) {
        this.currentVolume = Math.max(0, Math.min(1, volume));
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.currentVolume;
        }

        // Update UI
        this.updateUI();
        
        // Update mute state
        this.isMuted = this.currentVolume === 0;
    }

    // Toggle mute/unmute
    toggleMute() {
        if (this.isMuted) {
            // Unmute to previous volume or 50%
            this.setVolume(this.currentVolume > 0 ? this.currentVolume : 0.5);
        } else {
            // Mute
            this.setVolume(0);
        }
    }

    // Increase volume by 10%
    increaseVolume() {
        const newVolume = Math.min(1, this.currentVolume + 0.1);
        this.setVolume(newVolume);
    }

    // Decrease volume by 10%
    decreaseVolume() {
        const newVolume = Math.max(0, this.currentVolume - 0.1);
        this.setVolume(newVolume);
    }

    // Update UI elements
    updateUI() {
        if (!this.isInitialized) return;

        // Update slider
        this.volumeSlider.value = Math.round(this.currentVolume * 100);
        
        // Update display
        this.volumeDisplay.textContent = Math.round(this.currentVolume * 100) + '%';
        
        // Update mute button icon
        if (this.currentVolume === 0) {
            this.muteButton.textContent = '🔇';
            this.muteButton.title = 'Unmute';
        } else {
            this.muteButton.textContent = '🔊';
            this.muteButton.title = 'Mute';
        }

        // Update volume icon
        if (this.currentVolume === 0) {
            this.volumeIcon.textContent = '🔇';
            this.volumeIcon.title = 'Unmute';
        } else {
            this.volumeIcon.textContent = '🔊';
            this.volumeIcon.title = 'Mute';
        }
    }

    // Get current volume
    getVolume() {
        return this.currentVolume;
    }

    // Check if muted
    getIsMuted() {
        return this.isMuted;
    }

    // Set volume from external source (for integration with existing code)
    setVolumeFromExternal(volume) {
        this.setVolume(volume);
    }
}

// Create global volume control instance
const volumeControl = new VolumeControl();

// Function to initialize volume control after music is allowed
function initializeVolumeControl(backgroundMusicAudio) {
    if (volumeControl.init(backgroundMusicAudio)) {
        volumeControl.show();
        console.log('Volume control initialized and shown');
    } else {
        console.error('Failed to initialize volume control');
    }
}

// Function to hide volume control (if needed)
function hideVolumeControl() {
    volumeControl.hide();
}

// Function to show volume control (if needed)
function showVolumeControl() {
    volumeControl.show();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VolumeControl, volumeControl, initializeVolumeControl, hideVolumeControl, showVolumeControl };
}
