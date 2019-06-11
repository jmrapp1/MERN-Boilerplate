import * as ErrorBuilder from '../../../../shared/errors/ErrorBuilder';
import MapperUtils from '../../../../shared/mappers/MapperUtils';
import { InternalServerError } from '../../../../shared/errors/InternalServerError';

export function verifyStatus(response) {
    if (response.ok) {
        return response;
    }
    const error = new Error(response.statusText);
    error['response'] = response; // add response
    throw error;
}

export function dispatchDeleteRequest(route, successCallback, errorCallback) {
    return dispatchRequest(route, 'DELETE', {}, successCallback, errorCallback);
}

export function dispatchGetRequest(route, successCallback, errorCallback) {
    return dispatchRequest(route, 'GET', {}, successCallback, errorCallback);
}

export function dispatchPostRequest(route, body, successCallback, errorCallback) {
    return dispatchRequest(route, 'POST', body, successCallback, errorCallback);
}

export function dispatchPutRequest(route, body, successCallback, errorCallback) {
    return dispatchRequest(route, 'PUT', body, successCallback, errorCallback);
}

function dispatchRequest(route, method, body, successCallback, errorCallback) {
    return handleFetch(fetch(route, { ...getBodyByMethod(method, body), ...(headerOptions() as any) }), successCallback, errorCallback);
}

export function dispatchFilePostRequest(route, fileData, successCallback, errorCallback) {
    return handleFetch(fetch(route, {
        method: 'POST',
        body: fileData,
        ...(headerOptions({
            'charset': 'UTF-8',
            'Accept': 'application/json'
        }) as any)
    }), successCallback, errorCallback);
}

function handleFetch(fetch, successCallback, errorCallback) {
    return fetch
        .then(verifyStatus)
        .then(res => res.json())
        .then(data => {
            if (data['mapperData'] && data['mapperData']['mapperId']) {
                data = MapperUtils.buildFromMapper(data['mapperData']['mapperId'], data['mapperData']['isArray'], data['data']);
            }
            successCallback(data);
        })
        .catch(e => {
            const response = e['response'];
            if (response && response.json) {
                e['response'].json().then(json => {
                    if (ErrorBuilder.isJsonError(json)) {
                        const error = ErrorBuilder.buildErrorFromJson(json);
                        if (errorCallback) errorCallback(error); // Only send if supported error
                    } else {
                        console.error('CRITICAL: ' + JSON.stringify(json));
                        errorCallback(new InternalServerError());
                    }
                }).catch(err => {
                    console.error('CRITICAL: ' + JSON.stringify({ message: err.message, stack: err.stack }));
                    errorCallback(new InternalServerError());
                });
            } else {
                console.error('CRITICAL: ' + JSON.stringify({ message: e.message, stack: e.stack }));
                errorCallback(new InternalServerError());
            }
        });
}

const headers = {
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Accept': 'application/json'
};

function getBodyByMethod(method, body) {
    if (method.toLowerCase() === 'get') {
        return { method };
    }
    return { method, body: JSON.stringify(body) };
}

function headerOptions(otherHeaders: any = headers) {
    const auth = localStorage.getItem('id_token');
    if (auth) {
        return {
            headers: {
                Authorization: auth,
                ...otherHeaders
            }
        };
    }
    return { headers: otherHeaders };
}

export default {
    verifyStatus,
    dispatchGetRequest,
    dispatchPostRequest
};
