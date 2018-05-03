import UserRegisterMapper from './user/UserRegisterMapper';
import TestMapper from './test/TestMapper';
import UserLoginMapper from './user/UserLoginMapper';
import JwtMapper from './user/JwtMapper';

const mappers = [ UserRegisterMapper, UserLoginMapper, JwtMapper, TestMapper ];

export function buildFromMapper(mapperId: string, json) {
    for (let i = 0; i < mappers.length; i++) {
        if (mappers[i].id === mapperId) return mappers[i].build(json);
    }
    return json;
}

export default {
    buildFromMapper
};
