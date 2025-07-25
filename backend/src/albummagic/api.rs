use axum::{ extract::State, http::StatusCode, response::Json, routing::{ get, post }, Router };
use rspotify::prelude::*;
use serde::{ Deserialize, Serialize };
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;

use crate::albummagic::{ player::get_current_track, spotify_client::SpotifyClientManager };

#[derive(Serialize)]
pub struct AuthResponse {
    pub auth_url: String,
}

#[derive(Deserialize)]
#[allow(dead_code)]
pub struct CallbackRequest {
    pub code: String,
    pub state: Option<String>,
}

#[derive(Serialize)]
pub struct CallbackResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

#[derive(Serialize)]
pub struct AuthCheckResponse {
    pub authenticated: bool,
    pub user_info: Option<String>,
}

pub type AppState = Arc<Mutex<SpotifyClientManager>>;

pub fn create_app(spotify_manager: AppState) -> Router {
    Router::new()
        .route("/auth/url", get(get_auth_url))
        .route("/auth/callback", post(handle_callback))
        .route("/auth/check", get(check_auth))
        .route("/current-song", get(get_current_song))

        .with_state(spotify_manager)
        .layer(CorsLayer::permissive())
}

async fn get_auth_url(State(spotify_manager): State<AppState>) -> Result<
    Json<AuthResponse>,
    (StatusCode, Json<ErrorResponse>)
> {
    let mut manager = spotify_manager.lock().await;

    match manager.get_auth_url().await {
        Ok(auth_url) => Ok(Json(AuthResponse { auth_url })),
        Err(e) =>
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    error: format!("Failed to get auth URL: {}", e),
                }),
            )),
    }
}

async fn check_auth(State(spotify_manager): State<AppState>) -> Result<
    Json<AuthCheckResponse>,
    (StatusCode, Json<ErrorResponse>)
> {
    let manager = spotify_manager.lock().await;

    match manager.get_client().await {
        Some(client) => {
            match client.current_user().await {
                Ok(user) =>
                    Ok(
                        Json(AuthCheckResponse {
                            authenticated: true,
                            user_info: Some(user.display_name.unwrap_or(user.id.to_string())),
                        })
                    ),
                Err(_) =>
                    Ok(
                        Json(AuthCheckResponse {
                            authenticated: false,
                            user_info: None,
                        })
                    ),
            }
        }
        _ =>
            Ok(
                Json(AuthCheckResponse {
                    authenticated: false,
                    user_info: None,
                })
            ),
    }
}

async fn get_current_song(State(spotify_manager): State<AppState>) -> Result<
    Json<crate::albummagic::player::CurrentTrack>,
    (StatusCode, Json<ErrorResponse>)
> {
    let manager = spotify_manager.lock().await;

    match manager.get_client().await {
        Some(client) => {
            match get_current_track(client).await {
                Ok(track) => Ok(Json(track)),
                Err(e) =>
                    Err((
                        StatusCode::NOT_FOUND,
                        Json(ErrorResponse {
                            error: format!("No track currently playing: {}", e),
                        }),
                    )),
            }
        }
        _ =>
            Err((
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: "Not authenticated with Spotify".to_string(),
                }),
            )),
    }
}

// Input: Json { code: String, state: String } (both returned by Spotify after user authentication)
async fn handle_callback(
    State(spotify_manager): State<AppState>,
    Json(params): Json<CallbackRequest>
) -> Result<Json<CallbackResponse>, (StatusCode, Json<ErrorResponse>)> {
    let mut manager = spotify_manager.lock().await;

    match manager.handle_callback(&params.code).await {
        Ok(_) =>
            Ok(
                Json(CallbackResponse {
                    success: true,
                    message: "Successfully authenticated with Spotify".to_string(),
                })
            ),
        Err(e) =>
            Err((
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    error: format!("Failed to exchange code: {}", e),
                }),
            )),
    }
}
