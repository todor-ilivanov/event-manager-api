import { APIGatewayEvent } from 'aws-lambda';

export const buildMockRequest = (mockRequest: object): APIGatewayEvent => {
    return {
        body: JSON.stringify(mockRequest), requestContext: {
            identity: {
                cognitoIdentityId: "TEST-USER-1234"
            }
        }
    } as APIGatewayEvent;
}