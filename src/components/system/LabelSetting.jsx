import React from 'react';
import Header from '../layout/Header';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';

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
                            <Button variant="outlined" endIcon={<ClearIcon />} sx={{mr: 1}}>초기화</Button>
                            <Button variant="contained" endIcon={<SearchIcon />}>검색</Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Box sx={{mt: 5}}>
                <Container maxWidth="xl" /*sx={{bgcolor: "#cfe8fc"}}*/>
                    <LabelCodeGrid/>
                </Container>
            </Box>
        </>
    );
};

const LabelCodeGrid = () =>{
    const initRows = [
        { id: "a", labelCode: "abcd", useYn: "Y", modifyUser: "혁도", modifyDttm: "2022-10-09 02:03", status: "normal" }
       ,{ id: "b", labelCode: "efgh", useYn: "N", modifyUser: "혁도", modifyDttm: "2022-10-10 02:03", status: "normal" }
    ];
    const [rows, setRows] = React.useState(initRows);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const GridToolbar = () => {
        const handleAdd = () => {
            console.log(rows);
            console.log(selectionModel);
        };

        return(
            <GridToolbarContainer sx={{backgroundColor: "#cfe8fc"}}>
                <Box sx={{p: 1, width: "100%", display: "flex", justifyContent: "space-between", alignSelf: "center"}}>
                    <Typography variant="h5">라벨 코드</Typography>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button onClick={handleAdd} variant="contained" endIcon={<AddIcon />} sx={{mr: 1}}>추가</Button>
                        <Button variant="contained" endIcon={<SaveIcon />}>저장</Button>
                    </Box>
                </Box>
            </GridToolbarContainer>
        );
    };

    const setDelete = (id) => {
        //const row = 
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    }

    const deleteRender = ({id}) => {
        let row = null;
        for(let r of rows){
            if(r.id === id){
                row = r;
                break;
            }
        }
        
        let result = [];

        switch(row.status){
            case "delete":
                break;
            default:
                result.push(
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      onClick={setDelete(id)}
                    />
                );
                break;
        }
        return result;
    };

    const columns = [
        { field: "labelCode", headerName: "라벨코드", flex: 4, editable: true}
       ,{ field: "useYn", type: "singleSelect", valueOptions: ["Y", "N"], headerName: "사용여부", flex: 2, editable: true}
       ,{ field: "modifyUser", headerName: "수정자", flex: 2}
       ,{ field: "modifyDttm", headerName: "수정날짜", flex: 2}
       ,{ field: "actions", type: "actions", headerName: "삭제", flex: 1,
            cellClassName: "actions"
           ,getActions: id => deleteRender(id)
        }
    ];

    const processRowUpdate = (newRow) => {
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    };

    return(
        <>
            <Box sx={{ height: 400}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    components={{
                        Toolbar: GridToolbar
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={processRowUpdate}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                />
            </Box>
        </>
    );
};