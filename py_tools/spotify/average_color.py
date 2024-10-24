import numpy as np

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return [int(hex_code[i:i + 2], 16) for i in (0, 2, 4)]

def rgb_to_hex(rgb):
    return '#' + ''.join(f'{int(c):02x}' for c in rgb)

def dominant_color(hex_codes, n_clusters=1):
    rgb_values = np.array([hex_to_rgb(code) for code in hex_codes])
    
    # Randomly initialize cluster centers
    np.random.seed(0)  # For reproducibility
    random_indices = np.random.choice(rgb_values.shape[0], n_clusters, replace=False)
    centers = rgb_values[random_indices]

    for _ in range(10):  # Number of iterations
        # Assign each RGB value to the nearest cluster center
        distances = np.linalg.norm(rgb_values[:, np.newaxis] - centers, axis=2)
        labels = np.argmin(distances, axis=1)

        # Recalculate cluster centers
        new_centers = np.array([rgb_values[labels == i].mean(axis=0) for i in range(n_clusters)])

        # If centers do not change, break
        if np.all(centers == new_centers):
            break
        
        centers = new_centers

    dominant_color_rgb = centers[0].astype(int)
    return rgb_to_hex(dominant_color_rgb)

def main():
    hex_codes = ['#ff5733', '#33ff57', '#3357ff']
    
    dom_color = dominant_color(hex_codes)
    print(f'Dominant Color: {dom_color}')

if __name__ == '__main__':
    main()
