import numpy as np
from sklearn.cluster import KMeans

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return [int(hex_code[i:i + 2], 16) for i in (0, 2, 4)]

def rgb_to_hex(rgb):
    return '#' + ''.join(f'{int(c):02x}' for c in rgb)

def dominant_color(hex_codes, n_clusters=1):
    rgb_values = np.array([hex_to_rgb(code) for code in hex_codes])
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(rgb_values)
    dominant_color_rgb = kmeans.cluster_centers_[0]
    return rgb_to_hex(dominant_color_rgb)

def main():
    hex_codes = ['#ff5733', '#33ff57', '#3357ff']
    
    dom_color = dominant_color(hex_codes)
    print(f'Dominant Color: {dom_color}')

if __name__ == '__main__':
    main()
