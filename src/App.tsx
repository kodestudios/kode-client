import Layout from "./components/layout/layout";
import EditorContainer from "./components/editor/editor-container";
import Sidebar from "./components/sidebar";
import { initializeKeymaps, useKeymaps } from "@/features/keymaps";

initializeKeymaps();

export default function App() {
    useKeymaps();

    return (
        <Layout>
            <Sidebar />
            <EditorContainer />
        </Layout>
    );
}
