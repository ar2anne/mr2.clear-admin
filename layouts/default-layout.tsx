import ClearAppBar from "@components/clear-app-bar";
import { Container, Toolbar } from "@mui/material";

interface DefaultLayoutProps {
    children: any,
}
export default function DefaultLayout({ children }: DefaultLayoutProps) {
    return <>
        <ClearAppBar />
        <Toolbar />
        <Container>
            <br />
            {children}
        </Container>
    </>;
}