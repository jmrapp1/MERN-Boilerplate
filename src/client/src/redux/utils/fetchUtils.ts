import * as _ from 'lodash';
import * as ErrorBuilder from '../../../../shared/errors/ErrorBuilder';
import MapperUtils from '../../../../shared/mappers/MapperUtils';

export function verifyStatus(response) {
    if (response.ok) {
        return response;
    }
    const error = new Error(response.statusText);
    error['response'] = response; // add response
    throw error;
}

export function dispatchRequest(route, method, body, successCallback, errorCallback) {
    return fetch(route, { ...getBodyByMethod(method, body), ...headerOptions() })
        .then(verifyStatus)
        .then(res => res.json())
        .then(data => {
            if (data['mapperId']) data = MapperUtils.buildFromMapper(data['mapperId'], data);
            successCallback(data)
        })
        .catch(e => {
            if (e['response'] && e['response'].json) {
                e['response'].json().then(json => {
                    json = JSON.parse(json);
                    if (ErrorBuilder.isJsonError(json)) {
                        const error = ErrorBuilder.buildErrorFromJson(json);
                        if (errorCallback) errorCallback(json); // Only send if supported error
                    } else {
                        console.error('CRITICAL: ' + json);
                    }
                }).catch(err => {
                    console.error('CRITICAL: ' + err);
                });
            } else {
                console.error('CRITICAL: ' + e);
            }
        });
}

const headers = {
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Accept': 'application/json'
};

function getBodyByMethod(method, body) {
    if (_.lowerCase(method) === 'get') {
        return { method };
    }
    return { method, body: JSON.stringify(body) };
}

function headerOptions() {
    const auth = localStorage.getItem('id_token');
    if (auth) {
        return {
            headers: {
                Authorization: auth,
                ...headers
            }
        };
    }
    return { headers };
}

export default {
    verifyStatus,
    dispatchRequest
};
