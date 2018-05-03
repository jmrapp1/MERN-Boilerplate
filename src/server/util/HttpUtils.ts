
export function mappedResourceToJson(resource, mapperId: string) {
    const json = { ...JSON.parse(JSON.stringify(resource)), mapperId };
    delete json.validated; // Remove validated key from the resource
    return json;
}

export default {
    mappedResourceToJson
}
