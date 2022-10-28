import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import { useState } from "react";
import { arrayRemove, isEmpty, jsonCopy } from "utils/common"
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import { Component } from "./Component";
import { lighten } from '@mui/material/styles';


export const BasicGrid = (props) => {
    const title = isEmpty(props["title"]) ? "" : props["title"];
    const overlayId = isEmpty(props["overlayId"]) ? "" : props["overlayId"];
    const height = isEmpty(props["height"]) ? 400 : props["height"];
    const [rows, setRows] = [props["rows"], props["setRows"]];
    const [selectionModel, setSelectionModel] = [props["selectionModel"], props["setSelectionModel"]];
    const [newRowId, setNewRowId] = useState(1);
    const columns = isEmpty(props["columns"]) ? [] : jsonCopy(props["columns"]);
    columns.push({ field: "status", headerName: "상태"})
    if(props["restoreBtn"]){
        columns.push({ field: "restore", type: "actions", headerName: "복구", width: 10, getActions: (gridRowParams) => restoreRender(gridRowParams) });
    }
    if(props["deleteBtn"]){
        columns.push({ field: "delete", type: "actions", headerName: "삭제", width: 10, getActions: (gridRowParams) => deleteRender(gridRowParams) });
    }
    const idField = isEmpty(props["idField"]) ? "status" : props["idField"];
    const visibilityColumns = isEmpty(props["visibilityColumns"]) ? {} : jsonCopy(props["visibilityColumns"]);
    visibilityColumns["status"] = false;
    const defaultColumnValue = isEmpty(props["defaultColumnValue"]) ? {} : jsonCopy(props["defaultColumnValue"]);
    const rowClick = props["rowClick"];

    
    const addBtn = () => {
        const newId = "new" + newRowId;
        const newRow = {};
        newRow[idField] = newId;
        newRow["status"] = "new";

        for(const column of columns){
            const field = column["field"];
            const type = column["type"];
            if(type ==="actions" || field === idField || field === "status"){
                continue;
            }
            const defaultValue = isEmpty(defaultColumnValue[field]) ? null : defaultColumnValue[field];
            newRow[field] = defaultValue;
        }
        
        setRows([...rows, newRow]);
        setSelectionModel([...selectionModel, newId]);
        setNewRowId(newRowId + 1);
    };

    const saveBtn = () => {
        if(!isEmpty(props["save"])){
            props.save();
        }
    };

    const restoreRender = (gridRowParams) => {
        let row = gridRowParams["row"];
        let result = [];
        if(!isEmpty(row["origin"])){
            result.push(
                <GridActionsCellItem
                  icon={<ReplayIcon />}
                  label="restore"
                  onClick={()=>handleRestore(row)}
                />
            );
        }
        
        return result;
    };
    
    const handleRestore = (targetRow) => {
        setRows(rows.map((row) => {
            if(row[idField] === targetRow[idField]){
                if(isEmpty(row["origin"])){
                    return row;
                }else{
                    if(row["status"] === "delete"){
                        row["origin"]["status"] = "delete";
                    }else{
                        setSelectionModel(arrayRemove(jsonCopy(selectionModel), row[idField]));
                        row["origin"]["status"] = "normal";
                    }
                    return row["origin"];
                }
            }else{
                return row;
            }
        }));
    };

    const deleteRender = (gridRowParams) => {
        let row = gridRowParams["row"];
        let result = [];
        
        if(!isEmpty(row)){
            if(!isEmpty(row["status"]) && row["status"] === "delete"){
                result.push(
                    <GridActionsCellItem
                      icon={<RestoreFromTrashIcon />}
                      label="deleteCancel"
                      onClick={()=>handleDeleteCancel(row)}
                    />
                );
            }else{
                result.push(
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      onClick={()=>handleDelete(row)}
                    />
                );
            }
        }
        
        return result;
    };

    const handleDeleteCancel = (targetRow) => {
        setRows(rows.map((row) => {
            if(row[idField] === targetRow[idField]){
                const restoreRow = JSON.parse(JSON.stringify(row));
                if(isEmpty(restoreRow["origin"])){
                    if(restoreRow[idField].startsWith("new")){
                        restoreRow["status"] = "new";
                    }else{
                        restoreRow["status"] = "normal";
                        if(selectionModel.includes(restoreRow[idField])){
                            let selected = jsonCopy(selectionModel);
                            selected = arrayRemove(selected, restoreRow[idField]);
                            setSelectionModel(selected);
                        }
                    }
                }else{
                    restoreRow["status"] = "edit";
                }
                return restoreRow;
            }
            else{
                return row;
            }
        }));
    };

    const handleDelete = (targetRow) => {
        setRows(rows.map((row) => {
            if(row[idField] === targetRow[idField]){
                const removeRow = JSON.parse(JSON.stringify(row));
                removeRow.status = "delete";
                if(!selectionModel.includes(removeRow[idField])){
                    const selected = jsonCopy(selectionModel);
                    selected.push(removeRow[idField]);
                    setSelectionModel(selected);
                }
                return removeRow;
            }
            else{
                return row;
            }
        }));
    };

    const rowUpdate = (newRow, oldRow) => {
        let keys = Object.keys(newRow);
        keys = arrayRemove(keys, ["status", "origin"]);
        if(newRow["status"] === "normal"){
            let isChange = false;
            for(const key of keys){
                if(newRow[key] !== oldRow[key]){
                    isChange = true;
                    break;
                }
            }

            if(isChange){
                newRow["status"] = "edit";
                const origin = jsonCopy(oldRow);
                newRow["origin"] = origin;
                if(!selectionModel.includes(newRow[idField])){
                    const selected = jsonCopy(selectionModel);
                    selected.push(newRow[idField]);
                    setSelectionModel(selected);
                }
            }
        }else if(newRow["status"] === "edit"){
            let isChange = false;
            for(const key of keys){
                if(newRow[key] !== oldRow[key]){
                    isChange = true;
                    break;
                }
            }

            if(isChange){
                let isOrigin = true;
                const origin = oldRow["origin"];
                for(const key of keys){
                    if(newRow[key] !== origin[key]){
                        isOrigin = false;
                        break;
                    }
                }

                if(isOrigin){
                    if(newRow["status"] === "edit"){
                        newRow["status"] = "normal";
                        delete newRow["origin"];
                        if(selectionModel.includes(newRow[idField])){
                            let selected = jsonCopy(selectionModel);
                            selected = arrayRemove(selected, newRow[idField]);
                            setSelectionModel(selected);
                        }
                    }
                }else{
                    if(!selectionModel.includes(newRow[idField])){
                        const selected = jsonCopy(selectionModel);
                        selected.push(newRow[idField]);
                        setSelectionModel(selected);
                    }
                }
            }
        }else if(newRow["status"] === "delete"){
            let isChange = false;
            for(const key of keys){
                if(newRow[key] !== oldRow[key]){
                    isChange = true;
                    break;
                }
            }

            if(isChange){
                if(isEmpty(newRow["origin"])){
                    if(!newRow[idField].startsWith("new")){
                        const origin = jsonCopy(oldRow);
                        origin["status"] = "normal";
                        newRow["origin"] = origin;
                    }
                }else{
                    let isOrigin = true;
                    const origin = oldRow["origin"];
                    for(const key of keys){
                        if(newRow[key] !== origin[key]){
                            isOrigin = false;
                            break;
                        }
                    }

                    if(isOrigin){
                        delete newRow["origin"];
                    }
                }
                if(!selectionModel.includes(newRow[idField])){
                    const selected = jsonCopy(selectionModel);
                    selected.push(newRow[idField]);
                    setSelectionModel(selected);
                }
            }
        }
        setRows(rows.map((row) => (row[idField] === newRow[idField]) ? newRow : row));
        return newRow;
    };

    const ToolBar = () => {
        return(
            <GridToolbarContainer>
                <Box sx={{p: 1, width: "100%", display: "flex", justifyContent: "space-between", alignSelf: "center"}}>
                    <Typography variant="h5">{title}</Typography>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        { props["addBtn"] && <Button onClick={()=>addBtn()} variant="outlined" endIcon={<AddIcon />} sx={{mr: 1}}>추가</Button> }
                        { props["saveBtn"] && <Button onClick={()=>saveBtn()} variant="outlined" endIcon={<CheckIcon />}>저장</Button> }
                    </Box>
                </Box>
            </GridToolbarContainer>
        );
    };

    return (
        <Component overlayId={overlayId}>
            <Box
                sx={{
                    height: height,
                    '& .status-color--delete': {
                        bgcolor: (theme) => lighten(theme.palette.error.main, 0.7) + "!important",
                        '&:hover': {
                            bgcolor: (theme) => lighten(theme.palette.error.main, 0.6) + "!important"
                        }
                    },
                    '& .status-color--edit': {
                        bgcolor: (theme) => lighten(theme.palette.success.main, 0.7) + "!important",
                        '&:hover': {
                            bgcolor: (theme) => lighten(theme.palette.success.main, 0.6) + "!important"
                        }
                    },
                    '& .status-color--new': {
                        bgcolor: (theme) => lighten(theme.palette.primary.main, 0.7) + "!important",
                        '&:hover': {
                            bgcolor: (theme) => lighten(theme.palette.primary.main, 0.6) + "!important"
                        }
                    }
                }}
            >
                <DataGrid
                    rows={rows}
                    getRowId={(row) => row[idField]}
                    initialState={{
                        columns: {
                            columnVisibilityModel: visibilityColumns
                        }
                    }}
                    columns={columns}
                    components={{
                        Toolbar: ToolBar
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    getRowClassName={(params) => (`status-color--${params.row.status}`)}
                    processRowUpdate={(newRow, oldRow)=>rowUpdate(newRow, oldRow)}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    onRowClick={rowClick}
                />
            </Box>
        </Component>
    );
};