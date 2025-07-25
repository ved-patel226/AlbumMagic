use rspotify::{ prelude::*, scopes, AuthCodeSpotify, Credentials, OAuth };
use std::fs;
use std::path::Path;

const TOKEN_CACHE_FILE: &str = ".spotify_token_cache.json";

pub struct SpotifyClientManager {
    client: Option<AuthCodeSpotify>,
}

impl SpotifyClientManager {
    pub fn new() -> Self {
        Self { client: None }
    }

    pub async fn get_client(&self) -> Option<&AuthCodeSpotify> {
        self.client.as_ref()
    }

    pub async fn get_auth_url(&mut self) -> Result<String, Box<dyn std::error::Error>> {
        let spotify = self.create_spotify_client().await?;
        let url = spotify.get_authorize_url(false)?;
        self.client = Some(spotify);
        Ok(url)
    }

    pub async fn handle_callback(&mut self, code: &str) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(ref spotify) = self.client {
            spotify.request_token(code).await?;
            cache_token(spotify).await?;
            Ok(())
        } else {
            Err("No Spotify client initialized. Call get_auth_url first.".into())
        }
    }

    async fn create_spotify_client(&self) -> Result<AuthCodeSpotify, Box<dyn std::error::Error>> {
        let creds = Credentials::from_env().ok_or(
            "Failed to load Spotify credentials from environment"
        )?;
        let oauth = OAuth::from_env(scopes!("user-read-currently-playing")).ok_or(
            "Failed to load OAuth config from environment"
        )?;
        let spotify = AuthCodeSpotify::new(creds, oauth);

        // Try to load cached token
        if try_load_cached_token(&spotify).await? {
            return Ok(spotify);
        }

        Ok(spotify)
    }
}

async fn try_load_cached_token(
    spotify: &AuthCodeSpotify
) -> Result<bool, Box<dyn std::error::Error>> {
    if Path::new(TOKEN_CACHE_FILE).exists() {
        let token_data = fs::read_to_string(TOKEN_CACHE_FILE)?;
        if let Ok(token) = serde_json::from_str(&token_data) {
            *spotify.token.lock().await.unwrap() = Some(token);

            if spotify.current_user().await.is_ok() {
                println!("Using cached authentication token");
                return Ok(true);
            } else {
                println!("Cached token expired, requesting new authorization");
            }
        }
    }
    Ok(false)
}

async fn cache_token(spotify: &AuthCodeSpotify) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(token) = spotify.token.lock().await.unwrap().as_ref() {
        let token_json = serde_json::to_string_pretty(token)?;
        fs::write(TOKEN_CACHE_FILE, token_json)?;
        println!("Token cached for future use");
    }
    Ok(())
}
