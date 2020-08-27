import { Service } from 'typedi';
import Test, { TestDocument } from '../models/Test';
import { MongoDal } from '@jrapp/server-dal-mongodb';
import { TestResource } from '@jrapp/shared-resources-example';
import { ServiceResponse } from '@jrapp/server-core-web';
import { ExampleWebModule } from '../index';

@Service()
export default class TestService extends MongoDal<TestDocument> {

    constructor() {
        super(Test, ExampleWebModule.logger);
    }

    getTestById(id: string): Promise<ServiceResponse<TestDocument>> {
        return this.findById(id);
    }

    getTestByMessage(message: string): Promise<ServiceResponse<TestDocument[]>> {
        return this.find({ message }, 1);
    }

    async createTest(test: TestResource): Promise<ServiceResponse<TestDocument>> {
        const exists = await this.getTestByMessage(test.message);
        if (exists.data.length > 0) {
            throw new ServiceResponse('A test resource with that message already exists.', 400);
        }
        this.logger.info('Creating test resource with message ' + test.message);
        return this.insert({
            message: test.message
        });
    }

}
