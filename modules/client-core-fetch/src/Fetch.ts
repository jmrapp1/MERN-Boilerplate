import { ErrorBuilder, ResourceMappingManager, InternalServerError } from '@modulfy/shared-core-resources';
import { FetchMiddleware } from '..';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Accept': 'application/json'
};

export function dispatchDeleteRequest(route, successCallback, errorCallback, headers = defaultHeaders) {
    return dispatchRequest(route, 'DELETE', {}, successCallback, errorCallback, headers);
}

export function dispatchGetRequest(route, successCallback, errorCallback, headers = defaultHeaders) {
    return dispatchRequest(route, 'GET', {}, successCallback, errorCallback, headers);
}

export function dispatchPostRequest(route, body, successCallback, errorCallback, headers = defaultHeaders) {
    return dispatchRequest(route, 'POST', body, successCallback, errorCallback, headers);
}

export function dispatchPutRequest(route, body, successCallback, errorCallback, headers = defaultHeaders) {
    return dispatchRequest(route, 'PUT', body, successCallback, errorCallback, headers);
}

function getBodyByMethod(method, body) {
    if (method.toLowerCase() === 'get') {
        return { method };
    }
    return { method, body: JSON.stringify(body) };
}

export function dispatchRequest(route, method, body, successCallback, errorCallback, headers) {
    for (const m of FetchMiddleware.fetchMiddlewares) {
        m(route, method, body, headers);
    }
    return handleFetch(
        fetch(route, { ...getBodyByMethod(method, body), headers }),
        successCallback,
        errorCallback
    );
}

export function verifyStatus(response) {
    if (response.ok) {
        return response;
    }
    const error = new Error(response.statusText);
    error['response'] = response; // add response
    throw error;
}

function handleFetch(fetch, successCallback, errorCallback) {
    return fetch
        .then(verifyStatus)
        .then(res => res.json())
        .then(data => {
            if (data.mapperData?.mapperId) {
                data = ResourceMappingManager.buildFromMapper(data.mapperData.mapperId, data.mapperData.isArray, data.data);
            }
            successCallback(data);
        })
        .catch(async e => {
            try {
                const json = await e.response.json();
                if (ErrorBuilder.isJsonError(json)) {
                    const error = ErrorBuilder.buildErrorFromJson(json);
                    return errorCallback ? errorCallback(error) : undefined;
                }
                throw new Error(json);
            } catch (err) {
                console.error('CRITICAL: ' + JSON.stringify({ message: err.message, stack: err.stack }));
                errorCallback(new InternalServerError());
            }
        });
}