import { DocumentClient, GetItemOutput } from 'aws-sdk/clients/dynamodb';

export const getNewItemFromDb = async (dynamoDbClient: DocumentClient, userId: string, eventId: string): Promise<GetItemOutput> => {
    return await dynamoDbClient.get({
        TableName: process.env.tableName,
        Key: {
            userId: userId,
            eventId: eventId
        },
    }).promise();
}

export const cleanUp = async (dynamoDbClient: DocumentClient, userId: string, eventId: string) => {
    await dynamoDbClient.delete({
        TableName: process.env.tableName,
        Key: {
            userId: userId,
            eventId: eventId
        },
    }).promise();
};