import { expect } from 'chai';
import * as mocha from 'mocha';
import DatabaseSetup from '../util/DatabaseSetup';
import { Container } from 'typedi';
import TestService from './TestService';

const dbSetup = new DatabaseSetup();
const testService = Container.get(TestService);

describe('DatabaseService', () => {

    before(function(done) {
        this.timeout(10000);
        dbSetup.setupTestDb(db => {
            testService.delete({}).then(res => {
                expect(res.isFailed()).to.equal(false);
                done();
            });
        });
    });

    after(done => {
        testService.delete({}).then(res => {
            expect(res.isFailed()).to.equal(false);
            done();
        });
    });

    describe('Insert', () => {
        it('Should insert a test document', done => {
            const test = 'this is a unit test test';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                done();
            });
        });
        it('Should not insert if error present', done => {
            const test = 'this is a unit test test going to fail';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                testService.insert({ test }).then(res2 => {
                    expect(res2.isFailed()).to.equal(true);
                    done();
                });
            });
        });
    });

    describe('Update', () => {
        it('Should update a test document', done => {
            const test = 'this is a unit test test update';
            testService.insert({ test }).then(res => {
                expect(res.isSuccess()).to.equal(true);
                expect(res.data.test).to.equal(test);
                const newTest = 'this is the updated unit test test';
                testService.updateById(res.data._id, { test: newTest }).then(upRes => {
                    expect(upRes.isSuccess()).to.equal(true);
                    testService.findById(res.data._id).then(findRes => {
                        expect(findRes.isSuccess()).to.equal(true);
                        expect(findRes.data.test).to.equal(newTest);
                        done();
                    });
                });
            });
        });
    });

    describe('Delete', () => {
        it('Should insert and then delete a test document', done => {
            const test = 'this is a unit test test again';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                const id = res.data._id;
                testService.deleteById(id).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    expect(res2.data.test).to.equal(test);
                    done();
                });
            });
        });
    });

    describe('FindById', () => {
        it('Should insert and then find the test document by its ID', done => {
            const test = 'this is a unit test test again';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.findById(id).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    expect(res2.data._id.toString()).to.equal(id);
                    expect(res2.data.test).to.equal(test);
                    done();
                });
            });
        });
    });

    describe('Find All', () => {
        it('Should find all documents', done => {
            const test = 'this is a unit test test again again';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                testService.findAll().then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    expect(res2.data.length).to.equal(5);
                    done();
                });
            });
        });
    });

    describe('Count', () => {
        it('Should find the number of all documents', done => {
            testService.count().then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data).to.equal(5);
                done();
            });
        });
    });

    describe('Find With A Limit', () => {
        it('Should find a limited number of documents', done => {
            testService.count().then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data).to.equal(5);
                testService.findWithLimit({}, 2).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    expect(res2.data.length).to.equal(2);
                    done();
                });
            });
        });
        it('Should find a limited number of documents with an offset', done => {
            const test = 'find this with offset';
            testService.insert({ test }).then(inRes => {
                expect(inRes.isSuccess()).to.equal(true);
                testService.count().then(res => {
                    expect(res.isFailed()).to.equal(false);
                    expect(res.data).to.equal(6);
                    testService.findWithLimit({}, 1, 5).then(res2 => {
                        expect(res2.isFailed()).to.equal(false);
                        expect(res2.data.length).to.equal(1);
                        expect(res2.data[0].test).to.equal(test);
                        done();
                    });
                });
            });
        });
    });

    describe('Find By Key', () => {
        it('Should find document by key', done => {
            const test = 'this is a unit test test again again again';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.find({ test }).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    expect(res2.isEmpty()).to.equal(false);
                    expect(res2.data.length).to.equal(1);
                    expect(res2.data[0]._id.toString()).to.equal(id);
                    done();
                });
            });
        });
    });

    describe('Find By Key', () => {
        it('Should find document by key', done => {
            const testOne = 'this is a unit test update 1';
            const testTwo = 'this is a unit test update 2';
            testService.insert({ test: testOne }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(testOne);
                const id = res.data._id.toString();
                testService.updateById(id, { test: testTwo }).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    testService.findById(id).then(res3 => {
                        expect(res3.isFailed()).to.equal(false);
                        expect(res3.data._id.toString()).to.equal(id);
                        expect(res3.data.test).to.equal(testTwo);
                        done();
                    });
                });
            });
        });
    });

    describe('Delete By ID', () => {
        it('Should delete by ID', done => {
            const test = 'this is a unit test for delete';
            testService.insert({ test }).then(res => {
                expect(res.isFailed()).to.equal(false);
                expect(res.data.test).to.equal(test);
                const id = res.data._id.toString();
                testService.deleteById(id).then(res2 => {
                    expect(res2.isFailed()).to.equal(false);
                    testService.findById(id).then(res3 => {
                        expect(res3.isFailed()).to.equal(false);
                        expect(res3.isEmpty()).to.equal(true);
                        done();
                    });
                });
            });
        });
    });

});
