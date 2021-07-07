import { Context } from 'aws-lambda';
import { mockDynamoDbQuery } from '../testutils/dynamoDbUtils';
import { getAllEvents } from '../../getAllEvents';
import { buildMockRequest } from '../testutils/eventBuilders';

describe('getAllEvents lambda', () => {

    beforeAll(() => {
        process.env.tableName = 'mock-table-name';
    });

    it('gets all events when the user exists', async () => {
        const event = buildMockRequest({});
        const context = {} as Context;
        mockDynamoDbQuery([{ headline: 'test' }]);

        const response = await getAllEvents(event, context);
        const responseData = JSON.parse(response.body);

        expect(response.statusCode).toEqual(200);
        expect(responseData.length).toBeGreaterThan(0);
        expect(responseData[0].headline).toBe('test');
    });

    it('responds with empty list when user does not exist', async () => {
        const event = buildMockRequest({});
        const context = {} as Context;
        mockDynamoDbQuery([]);

        const response = await getAllEvents(event, context);
        const responseData = JSON.parse(response.body);

        expect(response.statusCode).toEqual(200);
        expect(responseData.length).toBe(0);
    });
});