import axios from "axios";


let apiHandle = axios.create({
    baseURL: "http://192.168.0.107:80/api"
    // baseURL: "https://5550b4f6-a152-4a40-8ef8-ebaac2eeaa31-00-3dc4dk01fy6sc.sisko.replit.dev/api/v1"
})

let GetApi = (endPoints: any) => {
    return apiHandle.get(endPoints)
}

let GetApiForSingle = (endPoints: any, id: any) => {
    return apiHandle.get(`${endPoints}/${id}`)
}

let PostApi = (endPoints: any, body: any) => {
    console.log(endPoints,"awd", body)
    return apiHandle.post(`${endPoints}`, body)
}
let formDataPostApi = (endPoints: any, body: any, isFormData = false) => {
    let config = {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    };

    return apiHandle.post(`${endPoints}`, isFormData ? body : JSON.stringify(body), config);
};



let PutApi = (endPoints: any, body: any, id: any) => {
    return apiHandle.put(`${endPoints}/${id}`, body)
}

let DeleteApi = (endPoints: any, id: any) => {
    return apiHandle.delete(`${endPoints}/${id}`)
}

export { GetApi, PostApi, PutApi, DeleteApi, GetApiForSingle, formDataPostApi }