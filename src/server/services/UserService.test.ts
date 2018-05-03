import { expect } from 'chai';
import * as mocha from 'mocha';
import DatabaseSetup from '../util/DatabaseSetup';
import { Container } from 'typedi';
import UserService from './UserService';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';

const dbSetup = new DatabaseSetup();
const userService = Container.get(UserService);

describe('UserService', () => {

    before(function (done) {
        this.timeout(10000);
        dbSetup.setupTestDb(db => {
            userService.delete({}).then(res => {
                expect(res.isFailed()).to.equal(false);
                done();
            });
        });
    });

    after(done => {
        userService.delete({}).then(res => {
            expect(res.isFailed()).to.equal(false);
            done();
        });
    });

    describe('Register', () => {
        describe('Email', () => {
            it('Should not validate when email is not valid', done => {
                userService.register(new UserRegisterResource('test123', 'testemail', 'bob', 'joe', 'phone', 'password', 'password')).then(res => {
                    expect(res.isFailed()).to.equal(true);
                    expect(res.data).to.equal('Please enter a valid email.');
                    done();
                });
            });
            it('Should validate when email is valid', done => {
                userService.register(new UserRegisterResource('test123', 'testemail@google.com', 'bob', 'joe', 'phone', 'password', 'password')).then(res => {
                    expect(res.data).to.not.equal('Please enter a valid email.');
                    done();
                });
            });
            it('Should not validate when email is not unique', done => {
                const email = 'testemail123@test.com';
                userService.insert({
                    username: 'test123',
                    email,
                    firstName: 'Test',
                    lastName: 'Test',
                    phone: '1112223333',
                    password: 'password',
                }).then(res => {
                    expect(res.isSuccess()).to.equal(true);
                    userService.register(new UserRegisterResource('test1234', email, 'bob', 'joe', '1112223333', 'password', 'password')).then(res2 => {
                        expect(res2.data).to.equal('That email has already been used.');
                        done();
                    });
                });
            });
        });
        describe('Password', () => {
            it('Should not validate when password is less than 6 characters', done => {
                userService.register(new UserRegisterResource('test1234', 'testemail@google.com', 'bob', 'joe', '1112223333', 'test', 'test')).then(res => {
                    expect(res.isFailed()).to.equal(true);
                    expect(res.data).to.equal('Please enter a password at least 6 characters long.');
                    done();
                });
            });
            it('Should validate when password is at least 6 characters', done => {
                userService.register(new UserRegisterResource('test1235', 'testemail@google.com', 'bob', 'joe', '1112223333', 'password', 'password')).then(res => {
                    expect(res.data).to.not.equal('Please enter a password at least 6 characters long.');
                    done();
                });
            });
            it('Should not validate when password does not match confirm password', done => {
                userService.register(new UserRegisterResource('test1236', 'testemail@google.com', 'bob', 'joe', '1112223333', 'teasdasda', 'asdasdsv')).then(res => {
                    expect(res.isFailed()).to.equal(true);
                    expect(res.data).to.equal('Please make sure the passwords match.');
                    done();
                });
            });
            it('Should validate when password matches confirm password', done => {
                userService.register(new UserRegisterResource('test1236', 'testemail@google.com', 'bob', 'joe', '1112223333', 'password', 'password')).then(res => {
                    expect(res.data).to.not.equal('Please make sure that passwords match.');
                    done();
                });
            });
        });
        describe('Phone', () => {
            it('Should not validate when phone is not valid', done => {
                userService.register(new UserRegisterResource('test123', 'testemail@google.com', 'bob', 'joe', 'phone', 'password', 'password')).then(res => {
                    expect(res.isFailed()).to.equal(true);
                    expect(res.data).to.equal('Please enter a valid phone number.');
                    done();
                });
            });
            it('Should validate when phone is valid', done => {
                userService.register(new UserRegisterResource('test123', 'testemail@google.com', 'bob', 'joe', '1112223333', 'password', 'password')).then(res => {
                    expect(res.data).to.not.equal('Please enter a valid phone number.');
                    done();
                });
            });
            it('Should not validate when phone contains non-numeric characters', done => {
                userService.register(new UserRegisterResource('test123', 'testemail@google.com', 'bob', 'joe', '111222333a', 'password', 'password')).then(res => {
                    expect(res.isFailed()).to.equal(true);
                    expect(res.data).to.equal('Please enter a valid phone number.');
                    done();
                });
            });
            it('Should validate when phone contains only non-numeric numbers', done => {
                userService.register(new UserRegisterResource('test123', 'testemail@google.com', 'bob', 'joe', '1112223333', 'password', 'password')).then(res => {
                    expect(res.data).to.not.equal('Please enter a valid phone number.');
                    done();
                });
            });
        });
    });

    describe('Login', () => {
        it('Should not log in with non-matching email & password', done => {
            userService.login(new UserLoginResource('fakelogin', 'test123')).then(res => {
                expect(res.isFailed()).to.equal(true);
                expect(res.data).to.equal('The username or password is incorrect.');
                done();
            });
        });
        it('Should login with matching username & password', done => {
            const username = 'thisisalogintest';
            const password = 'password';
            userService.insert({
                username,
                email: 'logintest123@test.com',
                firstName: 'Test',
                lastName: 'Test',
                phone: '1112223333',
                password,
            }).then(res => {
                expect(res.isSuccess()).to.equal(true);
                userService.login(new UserLoginResource(username, password)).then(loginRes => {
                    expect(loginRes.isFailed()).to.equal(false);
                    expect(loginRes.data.jwtToken).to.not.equal(undefined);
                    done();
                });
            });
        });
    });
});