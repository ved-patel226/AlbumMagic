mod albummagic {
    pub mod spotify_client;
    pub mod player;
    pub mod api;

    pub use spotify_client::SpotifyClientManager;
    pub use player::get_current_track;
}

use albummagic::api::create_app;
use std::sync::Arc;
use tokio::sync::Mutex;
use albummagic::SpotifyClientManager;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create shared state for Spotify client
    let spotify_manager = Arc::new(Mutex::new(SpotifyClientManager::new()));

    // Create the Axum app with routes
    let app = create_app(spotify_manager);

    // Run the server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await?;

    Ok(())
}
