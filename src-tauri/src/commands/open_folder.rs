use tauri_plugin_dialog::DialogExt;

/// Prompts the user with a native folder picker and returns the
/// selected absolute path, or `None` if the dialog was cancelled.
///
/// `blocking_pick_folder` is safe here because async tauri commands run on
/// the tokio worker pool — never on the UI thread.
#[tauri::command]
pub async fn open_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let folder = app.dialog().file().blocking_pick_folder();

    Ok(folder
        .and_then(|path| path.into_path().ok())
        .map(|path| path.to_string_lossy().into_owned()))
}
