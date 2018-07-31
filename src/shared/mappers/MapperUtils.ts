import UserRegisterMapper from './user/UserRegisterMapper';
import TestMapper from './test/TestMapper';
import UserLoginMapper from './user/UserLoginMapper';
import JwtMapper from './user/JwtMapper';
import GenericNameMapper from './generic/GenericNameMapper';
import GenericResource from '../resources/test/GenericResource';
import MyResource from '../resources/test/MyResource';

const GenericResourceMapper = new GenericNameMapper('GenericResourceMapper', GenericResource);
const MyResourceMapper = new GenericNameMapper('MyResourceMapper', MyResource, (key: string) => 'Please enter the value: ' + key);

export const GenericMappers = {
    GenericResourceMapper,
    MyResourceMapper
};

const mappers = [
    UserRegisterMapper,
    UserLoginMapper,
    JwtMapper,
    TestMapper,
    GenericResourceMapper,
    MyResourceMapper
];

export function buildFromMapper(mapperId: string, isArray: boolean, json) {
    for (let i = 0; i < mappers.length; i++) {
        if (mappers[ i ].id === mapperId) {
            if (!isArray) return mappers[ i ].build(cleanData(json));
            return json.map(data => mappers[ i ].build(cleanData(data)));
        }
    }
    return json;
}

function cleanData(data) {
    delete data['validated'];
    return data;
}

export default {
    buildFromMapper,
    GenericMappers
};
