use tauri::{AppHandle, WebviewWindow};

pub mod common;

pub use common::*;

pub fn default(
    app_handle: &AppHandle,
    main_window: WebviewWindow,
    preference_window: WebviewWindow,
) {
    #[cfg(debug_assertions)]
    main_window.open_devtools();

    platform(app_handle, main_window.clone(), preference_window.clone());
}
