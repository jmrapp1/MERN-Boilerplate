import { BodyParam, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import TestService from '../services/TestService';
import { Inject } from 'typedi';
import { encode } from 'jwt-simple';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { BuildResource } from '../decorators/BuildResource';
import TestMapper from '../../shared/mappers/test/TestMapper';
import TestResource from '../../shared/resources/test/TestResource';
import MapperUtils from '../../shared/mappers/MapperUtils';
import GenericResource from '../../shared/resources/test/GenericResource';
import MyResource from '../../shared/resources/test/MyResource';

@JsonController('/test')
export default class TestController {

    @Inject()
    testService: TestService;

    constructor() {
    }

    @UseBefore(AuthMiddleware)
    @Get('/testauth')
    testAuth(@Req() request: any, @Res() response: any) {
        return response.json({
            header: 'Your JWT data was verified and contains the following',
            data: {
                message: request.user
            }
        });
    }

    @Post('/test')
    postTest(@Res() res: any, @BuildResource(TestMapper, false) testResource: TestResource) {
        if (!testResource) return res;
        return res.json({ message: 'You posted "' + testResource.message + '"' });
    }

    @Get('/gettest')
    getTestStrict(@Res() res: any, @BuildResource(TestMapper) testResource: TestResource) {
        if (!testResource) return res;
        return res.json({ message: 'You get "' + testResource.message + '"' });
    }

    @Post('/generic')
    testGeneric(@Res() res: any, @BuildResource(MapperUtils.GenericMappers.GenericResourceMapper) genericResource: GenericResource) {
        if (!genericResource) return res;
        return res.json({ message: 'You posted "' + JSON.stringify(genericResource) + '"' });
    }

    @Post('/my')
    testMyResource(@Res() res: any, @BuildResource(MapperUtils.GenericMappers.MyResourceMapper) myResource: MyResource) {
        if (!myResource) return res;
        return res.json({ message: 'You posted "' + JSON.stringify(myResource) + '"' });
    }

    @Post('/teststrict')
    postTestStrict(@Res() res: any, @BuildResource(TestMapper) testResource: TestResource) {
        if (!testResource) return res;
        return res.json({ message: 'You posted "' + testResource.message + '"' });
    }

    @Post('/create')
    createTest(@BodyParam('test') test: String, @Res() res: any) {
        if (test) {
            console.log('testSerivce: ' + JSON.stringify(this.testService));
            const testObject = this.testService.createTest(test);
            return res.status(200).json(testObject);
        }
        return res.status(404).json({ error: 'Please enter a test message' });
    }

}
