import React from 'react';
import Header from '../layout/Header';
import { Box, Button, Container, Divider, Paper, Stack, TextField, Typography} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { lighten } from '@mui/material/styles';

const LabelSetting = () => {
    return(
        <>
            <Stack>
                <Header/>
                <Main/>
            </Stack>
        </>
    );
};

export default LabelSetting;

const Main = () => {
    return(
        <>
            <Box /*sx={{bgcolor: "#ffe8fc"}}*/>
                <Container maxWidth="xl" /*sx={{bgcolor: "#cfe8fc"}}*/>
                    <Typography sx={{mt: 5, mb: 3}} variant="h3">라벨 설정</Typography>
                    <Paper elevation={3} sx={{p: 2, display: "flex", justifyContent: "space-between"}}>
                        <TextField label="라벨 코드 / 라벨 명" variant="outlined" sx={{width: "45%"}}/>
                        <Box sx={{display: "flex", alignSelf: "center"}}>
                            <Button variant="contained" color="error" endIcon={<ClearIcon />} sx={{mr: 1}}>초기화</Button>
                            <Button variant="contained" endIcon={<SearchIcon />}>검색</Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Box sx={{mt: 5}}>
                <Container maxWidth="xl" /*sx={{bgcolor: "#cfe8fc"}}*/>
                    <LabelGrid/>
                </Container>
            </Box>
        </>
    );
};

const LabelGrid = () =>{
    // Label Code Grid
    const [labelCodeRows, setLabelCodeRows] = React.useState([]);
    const [labelCodeNewRowCount, setLabelCodeNewRowCount] = React.useState(1);
    const [selectionModel, setSelectionModel] = React.useState([]);

    // Label Name Grid
    const [labelNameRows, setLabelNameRows] = React.useState([]);

    const handleRestore = (id, rowStateObj) => {
        rowStateObj.setRows(rowStateObj.rows.map((row) => {
            if(row.id === id){
                const updateRow = JSON.parse(JSON.stringify(row));
                switch(row.status){
                    case "delete":
                        updateRow.status = "normal";
                        break;
                    case "delete-edit":
                        updateRow.status = "edit";
                        break;
                    default:
                        updateRow.status = "new";
                        break;
                }
                return updateRow;
            }
            else{
                return row;
            }
        }));
    }

    const handleDelete = (id, rowStateObj) => {
        rowStateObj.setRows(rowStateObj.rows.map((row) => {
            if(row.id === id){
                const updateRow = JSON.parse(JSON.stringify(row));
                switch(row.status){
                    case "normal":
                        updateRow.status = "delete";
                        break;
                    case "edit":
                        updateRow.status = "delete-edit";
                        break;
                    default:
                        updateRow.status = "delete-new";
                        break;
                }
                return updateRow;
            }
            else{
                return row;
            }
        }));
    }

    const deleteRender = (id, rowStateObj) => {
        let row = null;
        let result = [];
        for(let r of rowStateObj.rows){
            if(r.id === id){
                row = r;
                break;
            }
        }
        
        if(row !== null){
            if(row.status.startsWith("delete")){
                result.push(
                    <GridActionsCellItem
                      icon={<RestoreFromTrashIcon />}
                      label="Restore"
                      onClick={()=>handleRestore(id, rowStateObj)}
                    />
                );
            }else{
                result.push(
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      onClick={()=>handleDelete(id, rowStateObj)}
                    />
                );
            }
        }
        
        return result;
    };

    const processRowUpdate = (newRow) => {
        setLabelCodeRows(labelCodeRows.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    };

    const LabelCodeToolbar = () => {
        const handleAdd = () => {
            let date = new Date();
            let currentDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) +":" + ('0' + date.getSeconds()).slice(-2);
            const newRow = {
                id: labelCodeNewRowCount,
                labelCode: "",
                //useYn: "Y",
                modifyUser: "혁도",
                modifyDttm: currentDate,
                status: "new"
            };
            setLabelCodeRows((oldRows)=>[...oldRows, newRow]);
            setLabelCodeNewRowCount(labelCodeNewRowCount + 1);
        };

        const handleSave = () => {
            console.log(labelCodeRows);
            console.log(selectionModel);
        };

        return(
            <GridToolbarContainer>
                <Box sx={{p: 1, width: "100%", display: "flex", justifyContent: "space-between", alignSelf: "center"}}>
                    <Typography variant="h5">라벨 코드</Typography>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button onClick={handleAdd} variant="outlined" endIcon={<AddIcon />} sx={{mr: 1}}>추가</Button>
                        <Button onClick={handleSave} variant="outlined" endIcon={<CheckIcon />}>저장</Button>
                    </Box>
                </Box>
            </GridToolbarContainer>
        );
    };

    return(
        <Stack
            sx={{
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
                },
            }}
        >
            <Box sx={{height: 400}}>
                <DataGrid
                    rows={labelCodeRows}
                    columns={[
                         { field: "labelCode", headerName: "라벨코드", flex: 4, editable: true}
                        //,{ field: "useYn", type: "singleSelect", valueOptions: ["Y", "N"], headerName: "사용여부", flex: 2, editable: true}
                        ,{ field: "modifyUser", headerName: "수정자", flex: 2}
                        ,{ field: "modifyDttm", headerName: "수정날짜", flex: 2}
                        ,{ field: "actions", type: "actions", headerName: "삭제", width: 10, cellClassName: "actions" ,getActions: ({id}) => deleteRender(id, {rows: labelCodeRows, setRows: setLabelCodeRows}) }
                    ]}
                    components={{
                        Toolbar: LabelCodeToolbar
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={processRowUpdate}
                    getRowClassName={(params) => {
                        let classStatus = params.row.status;
                        if(classStatus.startsWith("delete")){
                            classStatus = "delete";
                        }
                        return `status-color--${classStatus}`
                    }}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    onRowClick={(params, event) => {
                          console.log(params);
                    }}
                />
            </Box>
            <Divider sx={{mb: 2, mt: 2}} />
            <Box sx={{height: 400}}>
                <DataGrid
                    rows={labelNameRows}
                    columns={[
                         { field: "labelCode", headerName: "라벨코드", flex: 2, editable: true}
                        ,{ field: "language", headerName: "언어", flex: 2}
                        ,{ field: "labelName", headerName: "라벨명", flex: 2, editable: true}
                        ,{ field: "modifyUser", headerName: "수정자", flex: 2}
                        ,{ field: "modifyDttm", headerName: "수정날짜", flex: 2}
                    ]}
                    components={{
                        Toolbar: ()=>{
                            return(
                                <GridToolbarContainer>
                                    <Box sx={{p: 1, width: "100%", display: "flex", justifyContent: "space-between", alignSelf: "center"}}>
                                        <Typography variant="h5">라벨명</Typography>
                                    </Box>
                                </GridToolbarContainer>
                            );
                        }
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={processRowUpdate}
                    getRowClassName={(params) => {
                        let classStatus = params.row.status;
                        if(classStatus.startsWith("delete")){
                            classStatus = "delete";
                        }
                        return `status-color--${classStatus}`
                    }}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                />
            </Box>
        </Stack>
    );
};