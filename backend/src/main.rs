mod albummagic {
    pub mod spotify_client;
    pub mod player;

    pub use spotify_client::get_spotify_client;
    pub use player::get_current_track;
}

use albummagic::{ get_spotify_client, get_current_track };

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let spotify = get_spotify_client().await?;

    let res = get_current_track(&spotify).await?;

    Ok(())
}
