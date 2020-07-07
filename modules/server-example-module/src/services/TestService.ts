import { Service } from 'typedi';
import Test, { TestDocument } from '../models/Test';
import { MongoDal } from '@jrapp/server-dal-mongodb';

@Service()
export default class TestService extends MongoDal<TestDocument> {

    model = Test;

    getTest(id: string) {
        return this.findById(id);
    }

    createTest(test: String) {
        return this.insert({
            test
        });
    }

}
