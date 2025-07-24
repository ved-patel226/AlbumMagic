use rspotify::{ prelude::*, scopes, AuthCodeSpotify, Credentials, OAuth };
use std::fs;
use std::path::Path;

const TOKEN_CACHE_FILE: &str = ".spotify_token_cache.json";

pub async fn get_spotify_client() -> Result<AuthCodeSpotify, Box<dyn std::error::Error>> {
    let creds = Credentials::from_env().ok_or(
        "Failed to load Spotify credentials from environment"
    )?;
    let oauth = OAuth::from_env(scopes!("user-read-currently-playing")).ok_or(
        "Failed to load OAuth config from environment"
    )?;
    let spotify = AuthCodeSpotify::new(creds, oauth);

    // Try to load cached token
    //TODO - Convert to cookies if frontend is deployed
    if Path::new(TOKEN_CACHE_FILE).exists() {
        let token_data = fs::read_to_string(TOKEN_CACHE_FILE)?;
        if let Ok(token) = serde_json::from_str(&token_data) {
            *spotify.token.lock().await.unwrap() = Some(token);

            if spotify.current_user().await.is_ok() {
                println!("Using cached authentication token");
                return Ok(spotify);
            } else {
                println!("Cached token expired, requesting new authorization");
            }
        }
    }

    // If we reach here, we need to get a new token
    let url = spotify.get_authorize_url(false)?;
    println!("Please visit this URL to authorize the application: {}", url);

    println!("Please enter the authorization code from the URL:");
    let mut code = String::new();
    std::io::stdin().read_line(&mut code)?;
    let code = code.trim();

    spotify.request_token(code).await?;

    // Cache the token
    //TODO - Convert to cookies if frontend is deployed
    if let Some(token) = spotify.token.lock().await.unwrap().as_ref() {
        let token_json = serde_json::to_string_pretty(token)?;
        fs::write(TOKEN_CACHE_FILE, token_json)?;
        println!("Token cached for future use");
    }
    Ok(spotify)
}
