import ResourceMapper from './mappers/ResourceMapper';

export class ResourceMappingManager {
    mappers: ResourceMapper[] = [];

    buildFromMapper(mapperId: string, isArray: boolean, json) {
        for (let i = 0; i < this.mappers.length; i++) {
            if (this.mappers[i].id === mapperId) {
                if (!isArray) return this.mappers[i].build(this.cleanData(json));
                return json.map(data => this.mappers[i].build(this.cleanData(data)));
            }
        }
        return json;
    }

    addMapper(mapper: ResourceMapper) {
        this.mappers.push(mapper);
    }

    cleanData(data) {
        delete data['validated'];
        return data;
    }

}

export default new ResourceMappingManager();
