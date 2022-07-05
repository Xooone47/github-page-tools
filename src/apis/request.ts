import axios, {AxiosPromise, AxiosRequestConfig} from 'axios';
import {get as lodashGet, assign, lowerCase} from 'lodash';

const defaultOptions = {
    withCredentials: true,
    headers: {'Content-Type': 'application/json;charset=utf-8'},
};

const formHttpOptions = {
    withCredentials: true,
    headers: {'Content-Type': 'multipart/form-data'},
};

const http = axios.create(defaultOptions);

const formHttp = axios.create(formHttpOptions);

const handleError = error => {
    const response = lodashGet(error, 'response');

    throw assign(lodashGet(response, 'data'), {
        status: lodashGet(response, 'status', -1),
    });
};

const handleResponse = ({data, headers}) => {
    if ('x-total-count' in headers) {
        return {
            totalCount: +lodashGet(headers, 'x-total-count'),
            results: data,
        };
    }
    return data;
};

const request = method => (url, data, ...extraOptions) => {
    const config = {
        url,
        method,
        ...extraOptions,
    };

    if (data) {
        const key = method === 'GET' ? 'params' : 'data';
        config[key] = data;
    }

    return http.request(config).catch(handleError).then(handleResponse);
};

const formatDataToFormData = data => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });

    return formData;
};

const formRequest = method => (url, data, ...extraOptions) => {
    const config = {
        url,
        method,
        data: formatDataToFormData(data),
        ...extraOptions,
    };

    return formHttp.request(config).catch(handleError).then(handleResponse);
};

// type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// type RequestParams<T = any> = T | { params: T } | { data: T };

// const getRequestParams = <P = any>(method: Method, originParams?: P): RequestParams<P> => {
//     const params = (originParams || {}) as P;
//     if (method === 'GET') {
//         return {params};
//     } else if (method === 'DELETE') {
//         return {data: params};
//     }
//     return params;
// };

// export const createApi = <Params = any, Data = any>(
//     method: Method,
//     url: string,
//     configs?: AxiosRequestConfig
// ) => {
//     return (params: Params): AxiosPromise<Data> => {
//         const requestFn = http[lowerCase(method)];

//         const requestParams = getRequestParams<Params>(method, params);

//         const requestConfigs = configs || {};

//         // http://axios-js.com/zh-cn/docs/index.html#%E8%AF%B7%E6%B1%82%E6%96%B9%E6%B3%95%E7%9A%84%E5%88%AB%E5%90%8D
//         if (['GET', 'DELETE'].includes(method)) {
//             return requestFn(url, {...requestParams, ...requestConfigs});
//         } else {
//             return requestFn(url, requestParams, requestConfigs);
//         }
//     };
// };

// // 用于开发时mock接口返回
// export const createMock = <Params = any, Data = any>(
//     mockData: Data
// ) => {
//     return (params: Params): AxiosPromise<Data> => {
//     // eslint-disable-next-line no-console
//         console.log(params);

//         // @ts-ignore
//         return Promise.resolve({
//             headers: {retcode: 0},
//             data: mockData,
//         });
//     };
// };

export const get = request('GET');

export const post = request('POST');

export const put = request('PUT');

export const remove = request('DELETE');

export const patch = request('PATCH');

export const postAsForm = formRequest('POST');
