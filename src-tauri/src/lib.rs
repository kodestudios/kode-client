mod commands;
mod menu;

use commands::{open_folder, read_directory};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init());

    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_process::init());
    }

    builder
        .invoke_handler(tauri::generate_handler![open_folder, read_directory])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                let menu = menu::build_app_menu(app.handle())?;
                app.set_menu(menu)?;
            }
            #[cfg(not(target_os = "macos"))]
            {
                let _ = app;
            }
            Ok(())
        })
        .on_menu_event(menu::handle_menu_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
