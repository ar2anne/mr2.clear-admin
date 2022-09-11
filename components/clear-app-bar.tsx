import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import ClearAppSearch from "./clear-app-search";

export default function ClearAppBar() {
    const form = useForm({
        defaultValues: { search:"" }
    })
    const router = useRouter();
    const handleSubmit = ({search}:{search:string}) => {
        router.push("/browse?s="+ search,undefined, {
            shallow: true
        })
    };
    return <>
        <AppBar position="fixed"
            elevation={1}>
            <Toolbar>
                <Typography variant="h6"
                    noWrap
                    component="div"
                    style={{cursor: "pointer"}}
                    onClick={()=> router.push("/")}
                    sx={{ flexGrow: 1 }}>
                    Clear Admin
                </Typography>
                <form id="form" onSubmit={form.handleSubmit(handleSubmit as any)}>
                    <Controller control={form.control} 
                        name="search"
                        render={({field})=><>
                            <ClearAppSearch props={field} />
                        </>} />
                </form>
                <Button color="secondary"
                    variant="contained"
                    type="submit"
                    form="form">Go</Button>
            </Toolbar>
        </AppBar>
    </>;
}