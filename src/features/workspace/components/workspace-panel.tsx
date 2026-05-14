import { useState } from "react";
import { FolderOpenIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { openFolder } from "../api";
import {
    useWorkspaceStore,
    workspaceName
} from "../stores/workspace-store";
import { FileTree } from "./file-tree";

export function WorkspacePanel() {
    const path = useWorkspaceStore((state) => state.path);

    if (!path) {
        return <WorkspaceEmptyState />;
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <FileTree rootPath={path} rootName={workspaceName(path) ?? path} />
        </div>
    );
}

function WorkspaceEmptyState() {
    const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
    const [isPicking, setIsPicking] = useState(false);

    const handleOpen = async () => {
        setIsPicking(true);
        try {
            const picked = await openFolder();
            if (picked) {
                setWorkspace(picked);
            }
        } finally {
            setIsPicking(false);
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-xs text-dark-200">No folder is open.</p>
            <Button
                variant="secondary"
                size="sm"
                leftIcon={<FolderOpenIcon className="size-3.5" weight="fill" />}
                loading={isPicking}
                onClick={() => {
                    void handleOpen();
                }}
            >
                Open folder
            </Button>
        </div>
    );
}
