import { Service } from 'typedi';

@Service()
export default class TestService {

    createTest(test: String) {
        return { test };
    }

}
