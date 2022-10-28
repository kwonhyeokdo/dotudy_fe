import React from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { isEmpty } from 'utils/common';

export const AlertPopup = ({open, setOpen, state, title, text, buttons}) => {
    const handleClose = () => {
        setOpen(false);
    };

    const DialogBody = () => {
        return(
            <Box>
                <DialogTitle id="alert-dialog-title">
                    {isEmpty(title) ? "Inforamtion" : title}
                </DialogTitle>
                <DialogContentText id="alert-dialog-description">
                    {isEmpty(text) ? "관리자에게 문의해주세요." : text}
                </DialogContentText>
                <DialogActions sx={{pr: 0}}>
                    {
                        (()=>{
                            const buttonArry = [];
                            if(isEmpty(buttons)){
                                buttonArry.push(
                                    <Button
                                        key="key"
                                        onClick={handleClose}
                                        variant="outlined"
                                        color={isEmpty(state) ? "primary" : state}
                                    >
                                        닫기
                                    </Button>
                                );
                            }else{
                                for(let i = 0; i < buttons.length; i++){
                                    const key = "key" + i;
                                    buttonArry.push(
                                        <Button 
                                            key={key} 
                                            //onClick={isEmpty(buttons[i].callback) ? handleClose : ()=>{buttons[i].callback(); handleClose();}}
                                            onClick={()=>{
                                                if(isEmpty(buttons[i].callback)){
                                                    handleClose();
                                                }else{
                                                    buttons[i].callback();
                                                    handleClose();
                                                }
                                            }}
                                            variant="outlined"
                                            color={isEmpty(buttons[i]["color"]) ? (isEmpty(state) ? "primary" : state) : buttons[i]["color"]}
                                        >
                                            {isEmpty(buttons[i]["text"]) ? "닫기" : buttons[i]["text"]}
                                        </Button>
                                    );
                                }
                            }
                            return buttonArry;
                        })()
                    }
                </DialogActions>
            </Box>
        );
    };

    return(
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {
                (()=>{
                    if(!isEmpty(state) && (state === "error" || state === "warning" || state === "info" || state === "success")){
                        return(
                            <DialogContent sx={{padding: 0}}>
                                <Alert sx={{pr: 5}} severity={state} variant="outlined">
                                    <DialogBody/>
                                </Alert>
                            </DialogContent>
                        );
                    }else{
                        return(
                            <DialogContent>
                                <DialogBody/>
                            </DialogContent>
                        );
                    }
                })()
            }
        </Dialog>
    );
};