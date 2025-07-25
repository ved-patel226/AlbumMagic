use rspotify::{ model::PlayableItem, prelude::*, AuthCodeSpotify };
use anyhow::Result;
use serde::Serialize;

#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct CurrentTrack {
    pub track_name: String,
    pub album_cover_url: String,
    pub artists: Vec<String>,
    pub album_name: String,
    pub duration_ms: i64,
    pub progress_ms: Option<i64>,
    pub is_playing: bool,
}

pub async fn get_current_track(spotify: &AuthCodeSpotify) -> Result<CurrentTrack> {
    match spotify.current_playing(None, None::<Vec<_>>).await? {
        Some(playing) => {
            match playing.item {
                Some(PlayableItem::Track(track)) => {
                    let current_track = CurrentTrack {
                        track_name: track.name.clone(),
                        album_cover_url: track.album.images
                            .first()
                            .map(|img| img.url.clone())
                            .unwrap_or_default(), // NOT type image::DynamicImage, will do that in frontend
                        artists: track.artists
                            .iter()
                            .map(|a| a.name.clone())
                            .collect(),
                        album_name: track.album.name.clone(),
                        duration_ms: track.duration.num_milliseconds(),
                        progress_ms: playing.progress.map(|p| p.num_milliseconds()),
                        is_playing: playing.is_playing,
                    };
                    Ok(current_track)
                }
                _ => Err(anyhow::anyhow!("No track is currently playing")),
            }
        }
        _ => Err(anyhow::anyhow!("No track is currently playing")),
    }
}
