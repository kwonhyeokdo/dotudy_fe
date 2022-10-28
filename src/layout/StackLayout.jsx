import { Stack } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./element/Header";

export const StackLayout = () =>{
    return (
        <Stack 
            sx={{
                width: "100vw"
            }}
        >
            <Header/>
            <Outlet/>
        </Stack>
    );
};