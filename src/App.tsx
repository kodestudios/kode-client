import Layout from "./components/layout/layout";
import EditorContainer from "./components/editor/editor-container";
import Sidebar from "./components/sidebar";
import {
    initializeKeymaps,
    useKeymapContextSync,
    useKeymaps,
    useMenuEvents
} from "@/features/keymaps";
import { useAutoUpdateCheck } from "@/features/updater";

initializeKeymaps();

export default function App() {
    useKeymaps();
    useMenuEvents();
    useKeymapContextSync();
    useAutoUpdateCheck();

    return (
        <Layout>
            <Sidebar />
            <EditorContainer />
        </Layout>
    );
}
