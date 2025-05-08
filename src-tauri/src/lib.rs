// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
mod bluesky;

#[derive(Serialize, Deserialize, Debug)]
pub struct Post {
    id: String,
    author: Author,
    text: String,
    created_at: String,
    images: Option<Vec<String>>,
    likes_count: i32,
    reposts_count: i32,
    replies_count: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Author {
    did: String,
    handle: String,
    display_name: String,
    avatar: Option<String>,
}

#[tauri::command]
fn get_timeline(service: &str, session: Option<&str>) -> Result<Vec<Post>, String> {
    bluesky::get_timeline();
    return Ok(Vec::new());
}

#[tauri::command]
fn login(service: &str, identifier: &str, password: &str) -> Result<String, String> {
    bluesky::login();
    return Ok("".to_string());
}

#[tauri::command]
async fn create_post(service: &str, session: &str, text: &str) -> Result<String, String> {
    bluesky::create_post();
    return Ok("".to_string());
}

#[tauri::command]
async fn like_post(service: &str, session: &str, post_uri: &str) -> Result<bool, String> {
    bluesky::like_post();
    return Ok(true);
}

#[tauri::command]
async fn get_post_detail(service: &str, session: Option<&str>, post_uri: &str) -> Result<Post, String> {
    bluesky::get_post_detail();
    return Ok(Post {
        id: "".to_string(),
        author: Author {
            did: "".to_string(),
            handle: "".to_string(),
            display_name: "".to_string(),
            avatar: None
        },
        text: "".to_string(),
        created_at: "".to_string(),
        images: None,
        likes_count: 0,
        reposts_count: 0,
        replies_count: 0
    });
}

#[tauri::command]
async fn get_post_replies(service: &str, session: Option<&str>, post_uri: &str) -> Result<Vec<Post>, String> {
    bluesky::get_post_replies();
    return Ok(Vec::new());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    bluesky::main();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_timeline,
            login,
            create_post,
            like_post,
            get_post_detail,
            get_post_replies
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
