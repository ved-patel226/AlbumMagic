import { getCurrentTime } from './time.js';

let previousTrackId = null;
let isDragging = false;
let fetchIntervalId = null;

async function fetchTrack() {
    if (isDragging) return; 

    const response = await fetch('/current-track');
    const data = await response.json();

    if (data.error) {
        document.getElementById('track-info').innerHTML = data.error;
    } else {
        if (data.track_id !== previousTrackId) {
            previousTrackId = data.track_id;

            document.getElementById('cover').src = data.cover_url;
            document.getElementById('track-name').innerText = data.track_name;
            document.getElementById('artist-name').innerText = data.artist_name;
            document.getElementById('album-name').innerText = data.album_name;

            document.documentElement.style.setProperty('--color-primary', data.colors[0]);
            document.documentElement.style.setProperty('--color-secondary', data.colors[1]);
            document.documentElement.style.setProperty('--color-tertiary', data.colors[2]);
            document.documentElement.style.setProperty('--color-background', data.average_color);
        }

        const progress = Math.floor(data.progress_ms / 1000);
        const duration = Math.floor(data.duration_ms / 1000);
        const percentage = (progress / duration) * 100;
        document.getElementById('progressBar').style.width = percentage + '%';

        
        if (data.playback) {
            document.getElementById('play').style.display = 'none';
            document.getElementById('pause').style.display = 'block';
        } else {
            document.getElementById('play').style.display = 'block';
            document.getElementById('pause').style.display = 'none';
        }
    }
}

async function updateProgressBar(position) {
    const progressContainer = document.querySelector('.progress-container');
    const response = await fetch('/current-track');
    const data = await response.json();

    const durationMs = data.duration_ms;
    const newPosition = Math.min(Math.max(position, 0), progressContainer.clientWidth);

    const percentage = (newPosition / progressContainer.clientWidth) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;

    const newPlaybackPosition = (newPosition / progressContainer.clientWidth) * durationMs;
    fetch(`/seek-track?position=${Math.floor(newPlaybackPosition)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

document.querySelector('.progress-container').addEventListener('mousedown', (event) => {
    isDragging = true; 
    const progressContainer = event.currentTarget;
    const position = event.clientX - progressContainer.getBoundingClientRect().left;
    updateProgressBar(position);

    
    clearInterval(fetchIntervalId);
});


document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const progressContainer = document.querySelector('.progress-container');
        const position = event.clientX - progressContainer.getBoundingClientRect().left;
        updateProgressBar(position);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;

    fetchIntervalId = setInterval(fetchTrack, 1000);
});

fetchIntervalId = setInterval(fetchTrack, 1000);
fetchTrack();
