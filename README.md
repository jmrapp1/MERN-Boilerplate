# Boilerplate For Node & Express Server With React & Redux

## Setup
- Add MongoDB Production and Test connection URLs in a new file `/.env` with the following contents:
```
MONGODB_URI=<prod-db-uri>
MONGODB_TEST_URI=<test-db-uri>
```
- `npm i`
- `npm run dev`

## Server Tests
- Will test any `*.test.ts` files
- `npm run test:server`

## "Oh great, another boilerplate repo."
I know what you're thinking: "Here's just another boilerplate repository with your standard packages and a basic frontend interface." I don't blame you. There's hundreds of boilerplate repositories you can find on Github, but you being here most likely means that you haven't found one that you're 100% content with. For about a year of doing web development and experimenting with different stacks I was constantly in that position. Some repositories were good, but there was always a piece missing or a design choice that I wasn't a fan of. I took note of my experiences and compiled a list of requirements that I thought were needed for a well-structured boilerplate. My two main issues with most boilerplate projects were the lack of resource standards and error handling between server and client, and the messy structure of controllers and services. This boilerplate focuses heavily on those two issues, and provides well-structured solutions to handle them.

## Features
- Working User Register & Login System
- Typescript On Client and Server
- Dynamic Controllers via [Routing-Controllers](https://github.com/typestack/routing-controllers)
- Service Injection via [Typedi](https://github.com/typestack/typedi)
- Shared Resource System
- Error Handling
- Logging System to output to AWS S3
- NodeJS & Express
- PassportJS
- React & Redux
- Mocha & Chai

## Shared Resource System

Because the server and client both are written in TypeScript we have the ability to share
code between them. The "shared" folder contains different resources and classes that 
are used on both sides.

By sharing code we are able to standardize communication between client and server and 
ensure that the data being transferred between them is valid. 

I implemented a "mapping" system which takes some type of JSON data, creates a defined resource
from that data, and then validates that the data is "good" by checking defined constraints. A resource is nothing
more than a basic class containing data that is meant to be passed between the client and server. For example,
the [UserRegisterMapper](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/mappers/user/UserRegisterMapper.ts)
contains functions to take in JSON data, verify different constraints (i.e. the email is valid, passwords match, etc.), return an error
if the constraints don't pass, and build the [UserRegisterResource](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/resources/user/UserRegisterResource.ts). 
The functions are used differently depending on whether the mapper is being used on the client or server side.

### Server-Side
On the server-side, data sent in from HTTP requests is passed into the mapper and validated. If the constraints
dont pass it will immediately send back a 400 response with the error message. If the constraints do pass it will
continue and send the built resource to the controller method.

I implemented a special decorator, `@BuildResource(mapper, strict)`, to be used in controller functions that will automagically build resources from the
HTTP request with a given mapper. You can see an example of it [here](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/server/controllers/UserController.ts#L20).
In that example we are building a `UserRegisterResource` using the `UserRegisterMapper` specified in the decorator. We also pass
in `true` to the decorator to tell it to be strict and check all constraints. If it's false it will skip them. The decorator is not able to
leave the controller method, so the next line checks if the `registerResource` is defined, and if it's not it means that the constraints did not
pass and we return the response (which contains the error set from the mapper).

### Client-Side
The server-side is able to take a resource and it's mapper, create a special JSON object, and send it over to the client. Every mapper has a unique
ID associated with it that is passed in along with the resource. You can see an example of it [here](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/server/controllers/UserController.ts#L32)
with the `HttpUtils.mappedResourceToJson(resource, mapperId)` function.
I have configured the client to detect this special JSON object and automagically build the resource on the client-side. The resource will then be passed out to 
wherever the request was originally made. This is all done within the [dispatch function](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/client/src/redux/utils/fetchUtils.ts#L14) I created
to be used when making any requests to the server. 

In order for your own mapper to be detected you must [add it to the array](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/mappers/MapperUtils.ts#L6) 
within the `MapperUtils`. 

## Generic Name Mapper

It's great to have resources to standardize communication between server and client, but the need to have a separate
mapper for each resource can become a bit excessive. In most cases you just want to map properties from an incoming request to
the resource using the same properties names. For example, say we have a `LoginResource` that contains the variables `username`
and `password`, and we are expecting the properties `username` and `password` to come through a POST request. The property names 
are the same, and the mapper would simply map the incoming data to the resource. I'd say this is the case about 75% of the time.
In order to prevent such simple mappers from piling up, I created the `GenericNameMapper`. This mapper allows you to handle 
these situations easily by instantiating an instance of it, giving it a unique ID, and passing in the resource type. You can
also optionally pass in a function to output a string when a variable is undefined. Here is [an example](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/mappers/MapperUtils.ts#L10)
of an implementation of the mapper. **NOTE:** When using the `GenericNameMapper` you _MUST_ set a value to the variables inside of the resource. It 
can be an empty string or `null`. It just has to be something. Refer to [this resource](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/resources/test/GenericResource.ts) to see an example.

## Error Handling

Similar to how the resource system works, HttpErrors are also shared between client and server. When an error occurs within controller
or service code on the server-side, a defined `HttpError` should be created and sent to the client. The `HttpError.getJson()` function will 
form the JSON object to be sent to the client, and the client automatically detects it and rebuilds the error. The client-side is configured to *only* 
pass errors out of the dispatched request that are defined. Any other errors are considered critical and will not be passed into the calling function
(you can change this if needed). This is done to ensure that whatever component made the request is going to receive an error that it knows how to handle.

When a resource is being built through the `@BuildResource` decorator, if any of the constraints fail it will create a `BadRequestError` and send it back
to the client. You can see the implementation [here](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/server/modules/resource-mapping/decorators/BuildResource.ts#L34).

If you create your own errors, you will need to add an if statement [here](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/shared/errors/ErrorBuilder.ts#L4) 
so that the client-side can detect and build the error.

## Connect Logging To AWS S3
The logging system offers the ability to connect to an AWS S3 bucket and output log files to it using the `s3-streamlogger` package. By default it is disabled.
In order to enable it you need to add the follow variables to your environment/.env file:
- `LOG_S3`: True/False - Enables logging to S3
- `S3_LOG_BUCKET_NAME`: Your S3 bucket name
- `AWS_ACCESS_KEY_ID`: AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Key

Whenever using the [`Logger`](https://github.com/jmrapp1/Node-React-Redux-Boilerplate/blob/master/src/server/util/Logger.ts) functions it will automatically write them out to S3.

## Screenshots
Login Page:
![](https://i.imgur.com/5sMDhen.png)

Register Page:
![](https://i.imgur.com/8ESSRXQ.png)
