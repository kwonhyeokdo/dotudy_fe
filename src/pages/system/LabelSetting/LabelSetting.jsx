import { Container, Divider } from "@mui/material";
import { AlertPopup } from "components/AlertPopup";
import { BasicGrid } from "components/BasicGrid";
import { Component } from "components/Component";
import { useEffect, useState } from "react";
import { isEmpty, toServer } from "utils/common";
import { LabelSearchBar } from "./LabelSearchBar";

export const LabelSetting = () => {
    // 검색단
    const [labelCode, setLabelCode] = useState("");
    const [labelName, setLabelName] = useState("");

    // 라벨 코드 그리드
    const [labelCodeRows, setLabelCodeRows] = useState([]);
    const [labelCodeSelectionModel, setLabelCodeSelectionModel] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    // 라벨명 그리드
    const [labelNameRows, setLabelNameRows] = useState([]);
    const [labelNameSelectionModel, setLabelNameSelectionModel] = useState([]);

    // Alert
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertState, setAlertState] = useState("info");
    const [alertText, setAlertText] = useState("");
    const [alertButtons, setAlertButtons] = useState();

    useEffect(()=>{
        searchLabel(labelCode, labelName);
    }, [labelCode, labelName]);

    const searchLabel = (labelCodeParam, labelNameParam) => {
        setLabelCodeSelectionModel([]);

        let url = "/system/label";
        url += "?labelCode=" + labelCodeParam;
        url += "&labelName=" + labelNameParam;

        toServer({
            url: url,
            method: "GET",
            overlayId: "labelGrid"
        }).then((reseponse)=>{
            console.log(reseponse.data);
            setLabelCodeRows(reseponse.data.labelCodeVO);
            setLabelNameRows(reseponse.data.labelNameVO);
            setLabelCode(labelCodeParam);
            setLabelName(labelNameParam);
        });
    };
    
    const saveLabelCode = () => {
        if(labelCodeSelectionModel.length === 0){
            setAlertState("info");
            setAlertText("선택된 항목이 없습니다.")
            setAlertButtons([{text: "닫기"}]);
            setAlertOpen(true);
            return;
        }

        const sendData = {
            insert: [],
            update: [],
            delete: []
        };
        
        labelCodeSelectionModel.forEach((rowId)=>{
            for(const row of labelCodeRows){
                if(row["labelId"] === rowId && row["status"] !== "normal"){
                    switch(row["status"]){
                        case "new":
                            sendData.insert.push(row);
                            break;
                        case "edit":
                            sendData.update.push(row)
                            break;
                        case "delete":
                            if(!rowId.startsWith("new")){
                                sendData.delete.push(row)
                            }
                            break;
                        default:
                            continue;
                    }
                    break;
                }
            }
        });

        if(sendData.insert.length === 0 && sendData.delete.length === 0 && sendData.update.length === 0){
            setAlertState("info");
            setAlertText("변경된 항목이 없습니다.")
            setAlertButtons([{text: "닫기"}]);
            setAlertOpen(true);
            return;
        }

        toServer({
            url: "/system/labelCode",
            method: "POST",
            data: sendData
        }).then((reseponse)=>{
            if(reseponse.data){
                setAlertState("info");
                setAlertText("저장이 완료되었습니다.")
                setAlertButtons([{text: "닫기", callback: ()=>{searchLabel(labelCode, labelName)}}]);
                setAlertOpen(true);
            }else{
                setAlertState("error");
                setAlertText("저장이 실패했습니다.\n관리자에게 문의해주세요.")
                setAlertButtons([{text: "닫기"}]);
                setAlertOpen(true);
            }
        });
    };

    const labelCodeRowClick = (params) => {
        if(selectedRow !== params.id){
            setSelectedRow(params.id);
        }
    };

    return (
        <Container maxWidth="xl">
            <AlertPopup
                open={alertOpen}
                setOpen={setAlertOpen}
                state={alertState}
                text={alertText}
                buttons={alertButtons}
            />
            <LabelSearchBar
                searchLabel={searchLabel}
            />
            <Divider sx={{borderColor: "rgba(0,0,0,0)", mt: 3, mb: 3}}/>
            <Component overlayId={"labelGrid"}>
                <BasicGrid
                    overlayId={"labelCode"}
                    title={"라벨 코드"}
                    rows={labelCodeRows}
                    setRows={setLabelCodeRows}
                    selectionModel={labelCodeSelectionModel}
                    setSelectionModel={setLabelCodeSelectionModel}
                    columns={[
                        { field: "labelId", headerName: "라벨ID"}
                        ,{ field: "labelCode", headerName: "라벨코드", flex: 4, editable: true}
                        ,{ field: "modifyUserId", headerName: "수정자", flex: 2}
                        ,{ field: "modifyDateTime", headerName: "수정날짜", flex: 2}
                    ]}
                    idField={"labelId"}
                    defaultColumnValue={{
                        modifyUserId: "혁도"
                    }}
                    visibilityColumns={{
                        labelId: false
                    }}
                    addBtn={true}
                    saveBtn={true}
                    save={saveLabelCode}
                    deleteBtn={true}
                    restoreBtn={true}
                    rowClick={labelCodeRowClick}
                />
                <Divider sx={{mt: 3, mb: 3}}/>
                <BasicGrid
                    overlayId={"labelName"}
                    title={"라벨명"}
                    rows={labelNameRows}
                    setRows={setLabelNameRows}
                    selectionModel={labelNameSelectionModel}
                    setSelectionModel={setLabelNameSelectionModel}
                    columns={[
                        { field: "labelId", headerName: "라벨ID"}
                        ,{ field: "labelCode", headerName: "라벨코드", flex: 4}
                        ,{ field: "languageCode", headerName: "언어코드", flex: 2}
                        ,{ field: "language", headerName: "언어", flex: 2 }
                        ,{ field: "labelName", headerName: "라벨명", flex: 4, editable: true}
                        ,{ field: "modifyUserId", headerName: "수정자", flex: 2}
                        ,{ field: "modifyDateTime", headerName: "수정날짜", flex: 2}
                    ]}
                    idField={"languageCode"}
                    defaultColumnValue={{
                        modifyUserId: "혁도"
                    }}
                    visibilityColumns={{
                        labelId: false,
                        languageCode: false
                    }}
                    addBtn={false}
                    saveBtn={true}
                    deleteBtn={false}
                    restoreBtn={true}
                />
                </Component>
        </Container>
    );
};