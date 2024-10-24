import requests
from PIL import Image
from io import BytesIO
import numpy as np

def get_top_colors(image_url, n_colors=3):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    
    img = img.resize((500, 500))
    data = np.array(img)
    
    pixels = data.reshape(-1, 3)
    
    # Randomly initialize cluster centers
    np.random.seed(0)  # For reproducibility
    random_indices = np.random.choice(pixels.shape[0], n_colors, replace=False)
    centers = pixels[random_indices]

    for _ in range(10):  # Number of iterations
        # Assign pixels to the nearest cluster center
        distances = np.linalg.norm(pixels[:, np.newaxis] - centers, axis=2)
        labels = np.argmin(distances, axis=1)

        # Recalculate cluster centers
        new_centers = np.array([pixels[labels == i].mean(axis=0) for i in range(n_colors)])
        
        # If centers do not change, break
        if np.all(centers == new_centers):
            break
        
        centers = new_centers

    top_colors = centers.astype(int)
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2]) for color in top_colors]
    
    return hex_colors
