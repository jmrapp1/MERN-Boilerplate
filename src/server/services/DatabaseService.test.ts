import { expect } from 'chai';
import * as mocha from 'mocha';
import DatabaseSetup from '../util/DatabaseSetup';
import { Container } from 'typedi';
import TestService from './TestService';

const dbSetup = new DatabaseSetup();
const testService = Container.get(TestService);

const blankFunc = () => {};

const reject = e => Promise.reject(e);

describe('DatabaseService', () => {

    before(function(done) {
        this.timeout(10000);
        dbSetup.setupTestDb(db => {
            testService.delete({}).then(res => {
                done();
            });
        });
    });

    after(done => {
        testService.delete({}).then(res => {
            done();
        });
    });

    describe('Insert', () => {
        it('Should insert a test document', () => {
            const test = 'this is a unit test test';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
            });
        });
        it('Should not insert if error present', done => {
            const test = 'this is a unit test test going to fail';
            testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                testService.insert({ test }).then(blankFunc, err => done());
            });
        });
    });

    describe('Update', () => {
        it('Should update a test document', () => {
            const test = 'this is a unit test test update';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                const newTest = 'this is the updated unit test test';
                testService.updateById(res.data._id, { test: newTest }).then(upRes => {
                    testService.findById(res.data._id).then(findRes => {
                        expect(findRes.data.test).to.equal(newTest);
                    });
                });
            });
        });
    });


    describe('Delete', () => {
        it('Should insert and then delete a test document', () => {
            const test = 'this is a unit test test again';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                const id = res.data._id;
                testService.deleteById(id).then(res2 => {
                    expect(res2.data.test).to.equal(test);
                });
            });
        });
    });


    describe('FindById', () => {
        it('Should insert and then find the test document by its ID', () => {
            const test = 'this is a unit test test again';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.findById(id).then(res2 => {
                    expect(res2.data._id.toString()).to.equal(id);
                    expect(res2.data.test).to.equal(test);
                });
            });
        });
    });


    describe('Find All', () => {
        it('Should find all documents', () => {
            const test = 'this is a unit test test again again';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                testService.findAll().then(res2 => {
                    expect(res2.data.length).to.equal(5);
                });
            });
        });
    });


    describe('Count', () => {
        it('Should find the number of all documents', () => {
            return testService.count().then(res => {
                expect(res.data).to.equal(5);
            });
        });
    });


    describe('Find With A Limit', () => {
        it('Should find a limited number of documents', () => {
            testService.count().then(res => {
                expect(res.data).to.equal(5);
                return testService.findWithLimit({}, 2).then(res2 => {
                    expect(res2.data.length).to.equal(2);
                });
            });
        });
        it('Should find a limited number of documents with an offset', () => {
            const test = 'find this with offset';
            return testService.insert({ test }).then(inRes => {
                testService.count().then(res => {
                    expect(res.data).to.equal(6);
                    testService.findWithLimit({}, 1, 5).then(res2 => {
                        expect(res2.data.length).to.equal(1);
                        expect(res2.data[0].test).to.equal(test);
                    });
                });
            });
        });
    });


    describe('Find By Key', () => {
        it('Should find document by key', () => {
            const test = 'this is a unit test test again again again';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.find({ test }).then(res2 => {
                    expect(res2.isEmpty()).to.equal(false);
                    expect(res2.data.length).to.equal(1);
                    expect(res2.data[0]._id.toString()).to.equal(id);
                });
            });
        });
    });

    describe('Find By Key', () => {
        it('Should find document by key', () => {
            const testOne = 'this is a unit test update 1';
            const testTwo = 'this is a unit test update 2';
            return testService.insert({ test: testOne }).then(res => {
                expect(res.data.test).to.equal(testOne);
                const id = res.data._id.toString();
                testService.updateById(id, { test: testTwo }).then(res2 => {
                    testService.findById(id).then(res3 => {
                        expect(res3.data._id.toString()).to.equal(id);
                        expect(res3.data.test).to.equal(testTwo);
                    });
                });
            });
        });
    });

    describe('Delete By ID', () => {
        it('Should delete by ID', () => {
            const test = 'this is a unit test for delete';
            return testService.insert({ test }).then(res => {
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.deleteById(id).then(res2 => {
                    testService.findById(id).then(res3 => {
                        expect(res3.isEmpty()).to.equal(true);
                    });
                });
            });
        });
    });


});
