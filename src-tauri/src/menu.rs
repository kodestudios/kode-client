use tauri::menu::{Menu, MenuEvent, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Runtime};

/// IDs prefixed with `cmd.` are forwarded to the frontend so the keymap
/// registry handles them — keeping menu and hotkey paths in lockstep.
const COMMAND_ID_PREFIX: &str = "cmd.";

/// Frontend event channel used to dispatch a registry command in response
/// to a menu activation.
pub const MENU_COMMAND_EVENT: &str = "menu:command";

/// Builds the application menu. Only meaningful on macOS — Windows/Linux
/// hide the OS menu since the app uses a custom titlebar.
pub fn build_app_menu<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let check_for_updates =
        MenuItemBuilder::with_id("cmd.app.checkForUpdates", "Check for Updates…").build(app)?;

    let app_submenu = SubmenuBuilder::new(app, "Kode")
        .about(None)
        .separator()
        .item(&check_for_updates)
        .separator()
        .services()
        .separator()
        .hide()
        .hide_others()
        .show_all()
        .separator()
        .quit()
        .build()?;

    let open_folder = MenuItemBuilder::with_id("cmd.workspace.openFolder", "Open Folder…")
        .accelerator("CmdOrCtrl+O")
        .build(app)?;

    let close_folder =
        MenuItemBuilder::with_id("cmd.workspace.closeFolder", "Close Folder").build(app)?;

    let file_submenu = SubmenuBuilder::new(app, "File")
        .item(&open_folder)
        .separator()
        .item(&close_folder)
        .build()?;

    let edit_submenu = SubmenuBuilder::new(app, "Edit")
        .undo()
        .redo()
        .separator()
        .cut()
        .copy()
        .paste()
        .select_all()
        .build()?;

    let window_submenu = SubmenuBuilder::new(app, "Window")
        .minimize()
        .maximize()
        .separator()
        .close_window()
        .build()?;

    tauri::menu::MenuBuilder::new(app)
        .item(&app_submenu)
        .item(&file_submenu)
        .item(&edit_submenu)
        .item(&window_submenu)
        .build()
}

/// Handles menu activations by emitting a `menu:command` event back to the
/// frontend with the bare command id (stripped of the `cmd.` prefix).
pub fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, event: MenuEvent) {
    let id = event.id().as_ref();
    if let Some(command_id) = id.strip_prefix(COMMAND_ID_PREFIX) {
        if let Err(err) = app.emit(MENU_COMMAND_EVENT, command_id) {
            eprintln!("failed to emit menu command {command_id}: {err}");
        }
    }
}
