import qs from "qs";
import axios, { AxiosResponse } from "axios";

let apiHandle = axios.create({
    baseURL: "http://192.168.0.107:80/api"
    // baseURL: "https://5550b4f6-a152-4a40-8ef8-ebaac2eeaa31-00-3dc4dk01fy6sc.sisko.replit.dev/api/v1"
});

// Add request interceptor
apiHandle.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Generic GET request with typed response
const GetApi = <T>(endPoint: string, params?: any): Promise<AxiosResponse<T>> => {
    return apiHandle.get<T>(endPoint, {
        params: params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'brackets' });
        }
    });
};

// GET single item with typed response
const GetApiForSingle = <T>(endPoint: string, id: string | number): Promise<AxiosResponse<T>> => {
    return apiHandle.get<T>(`${endPoint}/${id}`);
};

// POST request with typed response and body
const PostApi = <T>(endPoint: string, body: unknown): Promise<AxiosResponse<T>> => {
    return apiHandle.post<T>(endPoint, body);
};

// FormData POST with typed response
const formDataPostApi = <T>(
    endPoint: string, 
    body: FormData | unknown, 
    isFormData = false
): Promise<AxiosResponse<T>> => {
    const config = {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    };
    const payload = isFormData ? body : JSON.stringify(body);
    return apiHandle.post<T>(endPoint, payload, config);
};

// PUT request with typed response
const PutApi = <T>(
    endPoint: string, 
    body: unknown, 
    id: any
): Promise<AxiosResponse<T>> => {
    return apiHandle.put<T>(`${endPoint}/${id}`, body);
};

// DELETE request with typed response
const DeleteApi = <T>(
    endPoint: string, 
    id: string | number
): Promise<AxiosResponse<T>> => {
    return apiHandle.delete<T>(`${endPoint}/${id}`);
};

export { 
    GetApi, 
    PostApi, 
    PutApi, 
    DeleteApi, 
    GetApiForSingle, 
    formDataPostApi 
};