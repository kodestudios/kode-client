import Layout from "./components/layout/layout";
import EditorContainer from "./components/editor/editor-container";
import Sidebar from "./components/sidebar";

export default function App() {
    return (
        <Layout>
            <Sidebar />
            <EditorContainer />
        </Layout>
    );
}
