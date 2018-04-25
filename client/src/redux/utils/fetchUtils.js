import * as _ from 'lodash';

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
        .then(data => successCallback(data))
        .catch(e => {
            console.error('Dispatch Error: ' + e);
            if (e['response'] && e['response'].json) {
                if (e.response.status === 401) {
                    e['errors'] = ['You are not authorized to access this page.'];
                    if (errorCallback) {
                        errorCallback(e);
                    }
                } else {
                    e['response'].json().then(json => {
                        e['errors'] = json;
                        if (errorCallback) {
                            errorCallback(e);
                        }
                    }).catch(ex => {
                        console.error('Dispatch JSON Error: Object=' + JSON.stringify(ex));
                        if (errorCallback) {
                            errorCallback({ errors: e });
                        }
                    });
                }
            } else {
                if (errorCallback) {
                    errorCallback({ errors: e });
                }
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