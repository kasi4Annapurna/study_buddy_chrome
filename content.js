// Check if study mode is active
chrome.storage.local.get(['studyActive'], function(result) {
    if (result.studyActive) {
        blockSite();
    }
});

// Listen for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.studyActive) {
        if (changes.studyActive.newValue) {
            blockSite();
        } else {
            location.reload();
        }
    }
});

function blockSite() {
    // Hide the entire page content
    document.documentElement.style.display = 'none';
    
    // Create blocking overlay
    const overlay = document.createElement('div');
    overlay.id = 'study-buddy-block';
    overlay.innerHTML = `
        <div class="study-buddy-container">
            <div class="study-buddy-logo">📚</div>
            <h1>Study Buddy is Active</h1>
            <p>This site is blocked during your study session.</p>
            <p>Stay focused and keep studying! 💪</p>
            <div class="study-buddy-tips">
                <h3>Study Tips:</h3>
                <ul>
                    <li>Take breaks every 25-30 minutes</li>
                    <li>Stay hydrated</li>
                    <li>Review your notes regularly</li>
                    <li>Eliminate distractions</li>
                </ul>
            </div>
            <div class="study-buddy-motivation">
                "Success is the sum of small efforts repeated day in and day out."
            </div>
        </div>
    `;
    
    document.documentElement.appendChild(overlay);
}