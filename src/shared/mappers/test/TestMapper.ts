import ResourceMapper from '../ResourceMapper';
import TestResource from '../../resources/test/TestResource';

class TestMapper extends ResourceMapper {

    id = 'TestMapper';

    build(data): TestResource {
        return new TestResource(data.message);
    }

    verifyStrictConstraints(resource) {
        if (resource.message.length < 15) {
            return 'Please enter a message that is at least 15 characters long.';
        }
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter a message.';
    }

}

export default new TestMapper();
