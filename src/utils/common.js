import axios from "axios";

/**
 *  isEmpty
 *  @type {function}
 *  @param {All} value
 *  @return {boolean}
 *  @description param:value가 빈 요소인지 판단해준다.
 */
export const SERVER_CONTEXT_URL = "http://localhost:8080/dotudy";

export const isEmpty = (value) => {
    // null, undefined, 빈문자열 판단
    if(value === null || value === undefined || value === ""){
        return true;
    }
    
    // 빈 객체, 빈 배열 판단
    if(typeof(value) === "object"){
        if(Object.keys.length === 0){
            return true;
        }
    }

    return false;
};

/**
 *  isServer
 *  @type {function}
 *  @param {object} set
 *  @return {boolean}
 *  @description axios를 호출한다. param:set은 object이며 url, method는 필수 값이다.
 */
export const toServer = (set) => {
    return new Promise((resolve, reject)=>{
        const errorMessage = "param: set이 유효하지 않습니다.";
        if(isEmpty(set) || typeof(set) !== "object"){
            throw new Error(errorMessage);      
        }

        const keys = Object.keys(set);
        if(!keys.includes("url") || !keys.includes("method")){
            throw new Error(errorMessage);
        }

        if(typeof(set.url) !== "string"){
            throw new Error(errorMessage);
        }
        let url = SERVER_CONTEXT_URL + set.url;

        let method = set.method;
        if(typeof(method) !== "string"){
            throw new Error(errorMessage);
        }else{
            method = method.toUpperCase();
            if(!(method === "GET" || method === "POST" || method === "PUT" || method === "DELETE")){
                throw new Error(errorMessage);
            }
        }

        const contentType = isEmpty(set.contentType) ? "application/json;charset=UTF-8" : set.contentType;
        const data = isEmpty(set.data) ? null : set.data;
        
        const success = set.success;
        if(!isEmpty(success) && !(success instanceof Function)){
            throw new Error(errorMessage);
        }
        const fail = set.fail;
        if(!isEmpty(fail) && !(fail instanceof Function)){
            throw new Error(errorMessage);
        }
        
        const header = {
            "Content-Type": contentType
        };

        const overlayId = isEmpty(set["overlayId"]) ? null : set["overlayId"];
        
        axios({
            method: method,
            url: url,
            data: data,
            headers: header,
            overlayId: overlayId
        }).then((response)=>{
            resolve(response);
        })
        .catch((error)=>{
            reject(error);
        });
            
    });
};

export const setOverlayAxiosInterceptor = (overlayId, setOverlayDisplay) => {
    axios.interceptors.request.use(
        function (config) {
            if(overlayId === config.overlayId){
                setOverlayDisplay("flex");
            }
            return config
        },
        function (error) {
            return Promise.reject(error);
        }
    );
    
    axios.interceptors.response.use(
        function (response) {
            if(overlayId === response.config.overlayId){
                setOverlayDisplay("none");
            }
            return response;
        },
        function (error) {
            return Promise.reject(error);
        }
    );
}



/**
 *  arrayRemove
 *  @type {function}
 *  @param {Array} Array
 *  @param {Array} items
 *  @return {boolean}
 *  @description 배열 Array에서 items들을 찾아서 제거한다.
 */
 export const arrayRemove = (array, items) => {
    return array.filter(item => !items.includes(item));
 };

 /**
 *  arrayRemove
 *  @type {function}
 *  @param {Object} obj
 *  @return {Object} obj
 *  @description JSON.parse(), JSON.stringify()를 이용하여 객체를 복사한다.
 */
 export const jsonCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
 };