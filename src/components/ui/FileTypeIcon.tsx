import {
    FolderIcon,
    FolderOpenIcon,
    type IconWeight
} from "@phosphor-icons/react";
import { getIcon } from "material-file-icons";
import { cn } from "@/lib/cn";

const MONOCHROME_COLOR = "text-dark-200";
const FOLDER_COLOR = "text-dark-100";

/**
 * Replace hardcoded colors in an SVG with `currentColor` so it inherits the
 * surrounding text color (used for the monochrome variant).
 */
function toMonochromeSvg(svg: string) {
    return svg
        .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"')
        .replace(/stroke="(?!none")[^"]*"/g, 'stroke="currentColor"');
}

/** Returns the raw material-file-icons SVG string for a given filename. */
export function getFileIconSvg(name: string, colored = true) {
    const { svg } = getIcon(name);
    return colored ? svg : toMonochromeSvg(svg);
}

export interface FileTypeIconProps {
    /** File or directory name (e.g. "App.tsx", "src"). */
    name: string;
    /** Render a folder icon instead of resolving from `name`. */
    isDirectory?: boolean;
    /** When `isDirectory`, render the open-folder variant. */
    isOpen?: boolean;
    /** Apply the language brand color. Defaults to `true`. */
    colored?: boolean;
    /** Phosphor icon weight — only applies to folder icons. */
    weight?: IconWeight;
    /** Extra classes — merged via `cn`, so consumers can override size/color. */
    className?: string;
}

/**
 * Renders the Material Icon Theme glyph for a file (or a folder icon when
 * `isDirectory`). Same set of icons VSCode uses by default — recognizable
 * brand-colored marks for every common file type.
 *
 * @example
 * <FileTypeIcon name="App.tsx" className="size-4" />
 * <FileTypeIcon name="src" isDirectory isOpen className="size-4" />
 * <FileTypeIcon name="readme.md" colored={false} className="size-4" />
 */
export function FileTypeIcon({
    name,
    isDirectory = false,
    isOpen = false,
    colored = true,
    weight,
    className
}: FileTypeIconProps) {
    if (isDirectory) {
        const Glyph = isOpen ? FolderOpenIcon : FolderIcon;
        return (
            <Glyph
                weight={weight ?? "fill"}
                className={cn(FOLDER_COLOR, className)}
            />
        );
    }

    return (
        <span
            aria-hidden
            className={cn(
                "inline-flex shrink-0 [&>svg]:h-full [&>svg]:w-full",
                !colored && MONOCHROME_COLOR,
                className
            )}
            dangerouslySetInnerHTML={{ __html: getFileIconSvg(name, colored) }}
        />
    );
}
