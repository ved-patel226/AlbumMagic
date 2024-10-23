import requests
from PIL import Image
from io import BytesIO
import numpy as np
from sklearn.cluster import KMeans


def get_top_colors(image_url, n_colors=3):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    
    img = img.resize((500, 500))
    data = np.array(img)
    
    pixels = data.reshape(-1, 3)
    
    kmeans = KMeans(n_clusters=n_colors)
    kmeans.fit(pixels)
    
    top_colors = kmeans.cluster_centers_.astype(int)
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2]) for color in top_colors]
    
    return hex_colors

