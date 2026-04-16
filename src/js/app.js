// Application State
const STATE = {
    SCHEDULED: 'SCHEDULED',
    PLAYING: 'PLAYING',
    INTERMISSION: 'INTERMISSION',
    ENDED: 'ENDED'
};

const appState = {
    currentState: STATE.SCHEDULED,
    eventName: "Avengers: Endgame",
    startTime: null,
    intermissionEndTime: null,
    timerInterval: null
};

// DOM Elements - Global
const globalTimeEl = document.getElementById('global-time');

// DOM Elements - Admin
const adminTitleInput = document.getElementById('event-title');
const btnStart = document.getElementById('btn-start');
const btnIntermission = document.getElementById('btn-intermission');
const btnResume = document.getElementById('btn-resume');
const btnEnd = document.getElementById('btn-end');
const adminStatusDot = document.getElementById('admin-status-dot');
const adminStatusText = document.getElementById('admin-status-text');

// DOM Elements - Food Court
const fcEventTitle = document.getElementById('fc-event-title');
const fcStatusWidget = document.getElementById('fc-status-widget');
const fcStatusMessage = document.getElementById('fc-status-message');
const fcTimer = document.getElementById('fc-timer');
const fcTimerLabel = document.getElementById('fc-timer-label');

// DOM Elements - Washroom
const wrEventTitle = document.getElementById('wr-event-title');
const wrStatusWidget = document.getElementById('wr-status-widget');
const wrMainMessage = document.getElementById('wr-main-message');
const wrSubMessage = document.getElementById('wr-sub-message');
const wrUrgentTimerContainer = document.getElementById('wr-urgent-timer-container');
const wrTimer = document.getElementById('wr-timer');

// View Switching Logic
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active from all
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
        
        // Add active to clicked
        const viewId = e.target.getAttribute('data-view');
        e.target.classList.add('active');
        document.getElementById(`view-${viewId}`).classList.add('active');
    });
});

// Format time (HH:MM:SS)
function formatCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false });
}

// Format duration (MM:SS)
function formatDuration(seconds) {
    const m = Math.floor(Math.abs(seconds) / 60).toString().padStart(2, '0');
    const s = (Math.abs(seconds) % 60).toString().padStart(2, '0');
    return `${seconds < 0 ? '-' : ''}${m}:${s}`;
}

// Global Clock
setInterval(() => {
    globalTimeEl.innerText = formatCurrentTime();
}, 1000);

// Admin Title Sync
adminTitleInput.addEventListener('input', (e) => {
    appState.eventName = e.target.value || "Untitled Event";
    fcEventTitle.innerText = appState.eventName;
    wrEventTitle.innerText = appState.eventName;
});

// Helper: Clear widget state classes
function clearWidgetStates() {
    fcStatusWidget.classList.remove('state-playing', 'state-intermission', 'state-resume', 'state-ended');
    wrStatusWidget.classList.remove('state-playing', 'state-intermission', 'state-resume', 'state-ended');
    adminStatusDot.className = 'dot';
}

// State Updaters
function setScheduled() {
    appState.currentState = STATE.SCHEDULED;
    clearWidgetStates();
    
    // Admin
    btnStart.disabled = false;
    btnIntermission.disabled = true;
    btnResume.disabled = true;
    btnEnd.disabled = true;
    adminStatusText.innerText = "SCHEDULED";
    
    // Food Court
    fcStatusMessage.innerText = "Event is scheduled to start soon";
    fcTimer.innerText = "--:--";
    fcTimerLabel.innerText = "Wait Time";
    
    // Washroom
    wrMainMessage.innerText = "Event starts soon";
    wrSubMessage.innerText = "Find your seat";
    wrUrgentTimerContainer.classList.add('hidden');
}

function setPlaying() {
    appState.currentState = STATE.PLAYING;
    appState.startTime = new Date();
    clearWidgetStates();
    fcStatusWidget.classList.add('state-playing');
    wrStatusWidget.classList.add('state-playing');
    adminStatusDot.classList.add('blue');
    
    // Admin
    btnStart.disabled = true;
    btnIntermission.disabled = false;
    btnResume.disabled = true;
    btnEnd.disabled = false;
    adminStatusText.innerText = "PLAYING";
    
    // Food Court
    fcStatusMessage.innerText = "Event is currently running";
    fcTimerLabel.innerText = "Elapsed Time";
    
    // Washroom
    wrMainMessage.innerText = "Currently Playing";
    wrSubMessage.innerText = "Minimal queues. Return to your seat.";
    wrUrgentTimerContainer.classList.add('hidden');
    
    startTimer();
}

function setIntermission() {
    appState.currentState = STATE.INTERMISSION;
    // Set intermission default duration to 10 minutes (600 seconds) for demo we'll use 2 mins (120s)
    const intermissionDurationSec = 120; 
    appState.intermissionEndTime = new Date(Date.now() + intermissionDurationSec * 1000);
    
    clearWidgetStates();
    fcStatusWidget.classList.add('state-intermission');
    wrStatusWidget.classList.add('state-intermission');
    adminStatusDot.classList.add('orange');
    
    // Admin
    btnStart.disabled = true;
    btnIntermission.disabled = true;
    btnResume.disabled = false;
    btnEnd.disabled = false;
    adminStatusText.innerText = "INTERMISSION (2m)";
    
    // Food Court
    fcStatusMessage.innerText = "Intermission in progress";
    fcTimerLabel.innerText = "Resumes In";
    
    // Washroom
    wrMainMessage.innerText = "Intermission";
    wrSubMessage.innerText = "Queues are long. Please be quick.";
    wrUrgentTimerContainer.classList.remove('hidden');
    
    startTimer();
}

function setEnded() {
    appState.currentState = STATE.ENDED;
    clearWidgetStates();
    adminStatusDot.classList.add('green');
    
    // Admin
    btnStart.disabled = false;
    btnIntermission.disabled = true;
    btnResume.disabled = true;
    btnEnd.disabled = true;
    adminStatusText.innerText = "ENDED";
    
    // Food Court
    fcStatusWidget.classList.add('state-ended');
    fcStatusMessage.innerText = "Event has ended";
    fcTimer.innerText = "--:--";
    fcTimerLabel.innerText = "Final";
    
    // Washroom
    wrStatusWidget.classList.add('state-ended');
    wrMainMessage.innerText = "Event Ended";
    wrSubMessage.innerText = "Thank you for visiting.";
    wrUrgentTimerContainer.classList.add('hidden');
    
    stopTimer();
}

// Timer Logic
function startTimer() {
    stopTimer();
    appState.timerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay(); // Initial call
}

function stopTimer() {
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    if (appState.currentState === STATE.PLAYING) {
        // Calculate elapsed time
        const elapsedSec = Math.floor((new Date() - appState.startTime) / 1000);
        const tf = formatDuration(elapsedSec);
        fcTimer.innerText = tf;
        
    } else if (appState.currentState === STATE.INTERMISSION) {
        // Calculate time remaining
        let remainingSec = Math.floor((appState.intermissionEndTime - new Date()) / 1000);
        
        // Handle urgent state (less than 30s)
        if (remainingSec <= 30 && remainingSec > 0) {
            clearWidgetStates();
            fcStatusWidget.classList.add('state-resume');
            wrStatusWidget.classList.add('state-resume');
            adminStatusDot.className = 'dot red';
            
            wrMainMessage.innerText = "Hurry Back!";
            wrSubMessage.innerText = "Event is resuming momentarily.";
            fcStatusMessage.innerText = "Event resuming soon!";
        } else if (remainingSec <= 0) {
            remainingSec = 0;
            // Auto resume could go here, but we will wait for admin click or just show 00:00
            if(remainingSec === 0) setPlaying(); // Auto-resume demo
            return;
        }
        
        const tf = formatDuration(remainingSec);
        fcTimer.innerText = tf;
        wrTimer.innerText = tf;
    }
}

// Event Listeners
btnStart.addEventListener('click', setPlaying);
btnIntermission.addEventListener('click', setIntermission);
btnResume.addEventListener('click', setPlaying);
btnEnd.addEventListener('click', setEnded);

// Initialize
setScheduled();
