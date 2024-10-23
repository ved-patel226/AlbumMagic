document.getElementById('prev-link').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/previous-track')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.getElementById('next-link').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/skip-track')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.getElementById('pause-play').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/pause-playback')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log("Playback paused or played successfully");
            
            const pauseElement = document.getElementById('pause');
            if (pauseElement) {
                const computedStyle = window.getComputedStyle(pauseElement);
                if (computedStyle.display === 'none') {
                    pauseElement.style.display = 'block';
                    document.getElementById('play').style.display = 'none';
                } else {
                    document.getElementById('play').style.display = 'block';
                    pauseElement.style.display = 'none';
                }
            } else {
                console.error('Element with ID "pause" not found');
            }
        })
        
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

