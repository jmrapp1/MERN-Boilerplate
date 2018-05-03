import { Service } from 'typedi';
import DatabaseService from './DatabaseService';
import Test from '../models/Test';

@Service()
export default class TestService extends DatabaseService {

    model = Test;

    createTest(test: String) {
        return { test };
    }

}
