import Layout from "./components/layout/layout";
import EditorContainer from "./components/editor/editor-container";
import Sidebar from "./components/sidebar";
import {
    initializeKeymaps,
    useKeymapContextSync,
    useKeymaps,
    useMenuEvents
} from "@/features/keymaps";

initializeKeymaps();

export default function App() {
    useKeymaps();
    useMenuEvents();
    useKeymapContextSync();

    return (
        <Layout>
            <Sidebar />
            <EditorContainer />
        </Layout>
    );
}
