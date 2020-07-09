import TestResource from './resources/TestResource';
import TestMapper from './mappers/TestMapper';
import { ResourceMappingManager } from '@jrapp/shared-core-resources';

ResourceMappingManager.addMapper(TestMapper);

export {
    TestResource,
    TestMapper
}