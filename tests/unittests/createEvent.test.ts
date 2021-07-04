import { Context } from 'aws-lambda';
import { createEvent } from '../../createEvent';
import { DynamoDB } from 'aws-sdk';
import { mockBadCreationRequest, mockSuccessfulCreationRequest } from '../__mocks__/mockRequestObjects';
import { buildMockRequest } from '../testutils/eventBuilders';

describe('createEvents lambda', () => {

    beforeAll(() => {
        process.env.tableName = 'mock-table-name';
    });

    it('creates a new event when a valid request is passed', async () => {
        const event = buildMockRequest(mockSuccessfulCreationRequest);
        const context = {} as Context;

        const dynamoDbMockPut = jest.fn().mockImplementation(() =>
            ({ promise: () => Promise.resolve() })
        );
        DynamoDB.DocumentClient.prototype.put = dynamoDbMockPut;

        const response = await createEvent(event, context);
        expect(response.statusCode).toEqual(200);
        expect(dynamoDbMockPut).toHaveBeenCalled();
    });

    it('fails when the request doesn\'t pass validation', async () => {
        const event = buildMockRequest(mockBadCreationRequest);
        const context = {} as Context;

        const response = await createEvent(event, context);
        const errors = JSON.parse(response.body).errors;

        expect(response.statusCode).toEqual(400);
        expect(errors.length).toBe(3);
    });
});