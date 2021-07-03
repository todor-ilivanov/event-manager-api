import { APIGatewayEvent, Context } from 'aws-lambda';
import { createEvent } from '../../createEvent';
import { DynamoDB } from 'aws-sdk';
import { mockBadCreationRequest, mockSuccessfulCreationRequest } from '../__mocks__/mockRequestObjects';

describe('test event creation', () => {

    it('test event creation success', async () => {
        process.env.tableName = 'mock-table-name';
        const event = { body: JSON.stringify(mockSuccessfulCreationRequest) } as APIGatewayEvent;
        const context = {} as Context;

        const dynamoDbMockPut = jest.fn().mockImplementation(() =>
            ({ promise: () => Promise.resolve() })
        );
        DynamoDB.DocumentClient.prototype.put = dynamoDbMockPut;

        const response = await createEvent(event, context);
        expect(response.statusCode).toEqual(200);
        expect(dynamoDbMockPut).toHaveBeenCalled();
    });

    it('test event creation bad request', async () => {
        const event = { body: JSON.stringify(mockBadCreationRequest) } as APIGatewayEvent;
        const context = {} as Context;

        const response = await createEvent(event, context);
        const errors = JSON.parse(response.body).errors;

        expect(response.statusCode).toEqual(400);
        expect(errors.length).toBe(3);
    });
});