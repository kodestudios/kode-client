use std::path::PathBuf;

use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileTreeEntry {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
}

/// Reads the immediate children of the given directory. Entries are returned
/// with directories first, then files, both sorted alphabetically.
///
/// Lazy-loading children on demand keeps things fast for large projects;
/// the frontend calls this again for each folder the user expands.
#[tauri::command]
pub fn read_directory(path: String) -> Result<Vec<FileTreeEntry>, String> {
    let dir = PathBuf::from(&path);

    let read_dir = std::fs::read_dir(&dir).map_err(|err| err.to_string())?;

    let mut entries: Vec<FileTreeEntry> = read_dir
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| {
            let file_type = entry.file_type().ok()?;
            let entry_path = entry.path();
            let name = entry.file_name().to_string_lossy().into_owned();

            Some(FileTreeEntry {
                name,
                path: entry_path.to_string_lossy().into_owned(),
                is_directory: file_type.is_dir(),
            })
        })
        .collect();

    entries.sort_by(|a, b| match (a.is_directory, b.is_directory) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}
