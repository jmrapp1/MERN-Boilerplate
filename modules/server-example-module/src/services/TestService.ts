import { Service } from 'typedi';
import Test, { TestDocument } from '../models/Test';
import { MongoDal } from '@jrapp/server-dal-mongodb';
import { TestResource } from '@jrapp/shared-example-module';
import { ModuleLogger } from '../index';

@Service()
export default class TestService extends MongoDal<TestDocument> {

    constructor() {
        super(Test);
    }

    getTest(id: string) {
        return this.findById(id);
    }

    createTest(test: TestResource) {
        ModuleLogger.info('Creating test resource with message ' + test.message);
        return this.insert({
            message: test.message
        });
    }

}
