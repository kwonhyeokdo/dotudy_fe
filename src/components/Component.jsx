import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { isEmpty, setOverlayAxiosInterceptor } from "utils/common";

export const Component = (props) => {
    const [overlayDisplay, setOverlayDisplay] = useState("none");

    if(!isEmpty(props["overlayId"])){
        setOverlayAxiosInterceptor(props.overlayId, setOverlayDisplay);
    }

    return(
        <Box
            sx={{
                position : "relative",
                display : "inline-block",
                width: "100%"
            }}
        >
            {props.children}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top : 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "1000",
                    bgcolor: "white",
                    opacity: 1,
                    display: overlayDisplay,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </Box>
        </Box>
    );
};