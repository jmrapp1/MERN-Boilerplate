import { Service } from 'typedi';
import DatabaseService from './DatabaseService';
import Test, { TestDocument } from '../models/Test';

@Service()
export default class TestService extends DatabaseService<TestDocument> {

    model = Test;

    createTest(test: String) {
        return { test };
    }

}
