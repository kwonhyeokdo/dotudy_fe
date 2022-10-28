import { Component } from "components/Component";
import { Button } from "@mui/material";
import { toServer } from "utils/common";

export const SampleComponent = (props) => {

    const handleClick1 = () => {
        toServer({
            method: "GET",
            url: "/system/messages",
            overlayId: props.overlayId
        }).then((response)=>{
            console.log(response);
        });
    };

    return(
        <Component overlayId={props.overlayId}>
            <Button onClick={()=>handleClick1()} sx={{width: 500, height: 500, bgcolor: "blue"}}></Button>
        </Component>
    );
};