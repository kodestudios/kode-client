import Layout from "./components/layout/layout";
import { Outlet } from "@tanstack/react-router";

export default function App() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}
