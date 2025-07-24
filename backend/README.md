# Spotify Current Playing Track Reader

This Rust application uses the `rspotify` crate to get information about the currently playing song on Spotify.

## Setup

1. **Create a Spotify App:**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Note down your Client ID and Client Secret
   - Add `http://localhost:8888/callback` as a redirect URI in your app settings

2. **Configure Environment Variables:**

   - Update the `.env` file with your actual Spotify credentials:

   ```
   RSPOTIFY_CLIENT_ID=your_actual_client_id
   RSPOTIFY_CLIENT_SECRET=your_actual_client_secret
   RSPOTIFY_REDIRECT_URI=http://localhost:8888/callback
   ```

3. **Run the Application:**

   ```bash
   cargo run
   ```

4. **Authorization Flow:**
   - The app will print an authorization URL
   - Visit the URL in your browser and authorize the application
   - Copy the authorization code from the callback URL
   - Paste it into the terminal when prompted

## Features

The application will display:

- Track name
- Artist(s)
- Album name
- Duration
- Current progress
- Playing status

It also handles podcast episodes if you're listening to a podcast instead of music.

## Requirements

- Rust (latest stable version)
- Active Spotify Premium account (required for current playback API)
- Internet connection
