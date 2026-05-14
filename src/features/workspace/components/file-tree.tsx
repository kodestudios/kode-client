import { useEffect, useState } from "react";
import {
    CaretDownIcon,
    CaretRightIcon,
    FileIcon,
    FolderIcon,
    FolderOpenIcon
} from "@phosphor-icons/react";
import { readDirectory, type FileTreeEntry } from "../api";
import { cn } from "@/lib/cn";

const INDENT_BASE_PX = 8;
const INDENT_STEP_PX = 12;

function indentPaddingLeft(depth: number) {
    return INDENT_BASE_PX + depth * INDENT_STEP_PX;
}

interface FileTreeProps {
    rootPath: string;
    rootName: string;
}

export function FileTree({ rootPath, rootName }: FileTreeProps) {
    return (
        <div className="flex flex-col py-1 text-xs text-dark-50 select-none">
            <FileTreeNode
                entry={{
                    name: rootName,
                    path: rootPath,
                    isDirectory: true
                }}
                depth={0}
                defaultOpen
            />
        </div>
    );
}

interface DirectoryChildrenProps {
    path: string;
    depth: number;
}

function DirectoryChildren({ path, depth }: DirectoryChildrenProps) {
    const [entries, setEntries] = useState<FileTreeEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setEntries(null);
        setError(null);

        readDirectory(path)
            .then((result) => {
                if (cancelled) return;
                setEntries(result);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : String(err));
                setEntries([]);
            });

        return () => {
            cancelled = true;
        };
    }, [path]);

    if (error) {
        return (
            <StatusRow depth={depth} tone="error">
                {error}
            </StatusRow>
        );
    }

    if (entries === null) {
        return <StatusRow depth={depth}>Loading…</StatusRow>;
    }

    if (entries.length === 0) {
        return (
            <StatusRow depth={depth} tone="muted">
                empty
            </StatusRow>
        );
    }

    return (
        <>
            {entries.map((entry) => (
                <FileTreeNode key={entry.path} entry={entry} depth={depth} />
            ))}
        </>
    );
}

interface FileTreeNodeProps {
    entry: FileTreeEntry;
    depth: number;
    defaultOpen?: boolean;
}

function FileTreeNode({
    entry,
    depth,
    defaultOpen = false
}: FileTreeNodeProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (entry.isDirectory) {
        const Caret = isOpen ? CaretDownIcon : CaretRightIcon;
        const FolderGlyph = isOpen ? FolderOpenIcon : FolderIcon;

        return (
            <>
                <Row depth={depth} onClick={() => setIsOpen((value) => !value)}>
                    <Caret
                        className="size-3 shrink-0 text-dark-300"
                        weight="bold"
                    />
                    <FolderGlyph
                        className="size-4 shrink-0 text-dark-100"
                        weight="fill"
                    />
                    <span className="truncate">{entry.name}</span>
                </Row>
                {isOpen && (
                    <DirectoryChildren path={entry.path} depth={depth + 1} />
                )}
            </>
        );
    }

    return (
        <Row depth={depth} onClick={() => {}}>
            <span className="size-3 shrink-0" aria-hidden />
            <FileIcon
                className="size-4 shrink-0 text-dark-300"
                weight="regular"
            />
            <span className="truncate">{entry.name}</span>
        </Row>
    );
}

interface RowProps {
    depth: number;
    onClick: () => void;
    children: React.ReactNode;
}

function Row({ depth, onClick, children }: RowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{ paddingLeft: indentPaddingLeft(depth) }}
            className={cn(
                "flex w-full items-center gap-1.5 py-0.5 pr-2 text-left",
                "text-dark-100 hover:bg-dark-800 hover:text-dark-50"
            )}
        >
            {children}
        </button>
    );
}

interface StatusRowProps {
    depth: number;
    tone?: "default" | "muted" | "error";
    children: React.ReactNode;
}

function StatusRow({ depth, tone = "default", children }: StatusRowProps) {
    return (
        <div
            style={{ paddingLeft: indentPaddingLeft(depth) }}
            className={cn(
                "py-0.5 pr-2 text-xs",
                tone === "error" && "text-red-400",
                tone === "muted" && "text-dark-400 italic",
                tone === "default" && "text-dark-300"
            )}
        >
            {children}
        </div>
    );
}
