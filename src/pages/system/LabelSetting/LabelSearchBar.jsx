import { Button, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Component } from "components/Component";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useRef } from "react";

export const LabelSearchBar = (props) => {
    const labelCodeRef = useRef();
    const labelNameRef = useRef();
    const initBtn = () => {
        labelCodeRef.current.value = "";
        labelNameRef.current.value = "";
    };

    const searchBtn = () => {
        props.searchLabel(labelCodeRef.current.value, labelNameRef.current.value);
    };

    return(
        <Component>
            <Typography sx={{mt: 5, mb: 3}} variant="h4">라벨 설정</Typography>
            <Paper elevation={3} sx={{p: 2, display: "flex", justifyContent: "space-between"}}>
                <Box sx={{width: "70%"}}>
                    <TextField inputRef={labelCodeRef} label="라벨 코드" variant="outlined" sx={{width: "45%", mr: 5}}/>
                    <TextField inputRef={labelNameRef} label="라벨 명" variant="outlined" sx={{width: "45%"}}/>
                </Box>
                <Box sx={{display: "flex", alignSelf: "center"}}>
                    <Button onClick={()=>{initBtn()}} variant="contained" color="error" endIcon={<ClearIcon />} sx={{mr: 1}}>초기화</Button>
                    <Button onClick={()=>{searchBtn()}} variant="contained" endIcon={<SearchIcon />}>검색</Button>
                </Box>
            </Paper>
        </Component>
    );
};