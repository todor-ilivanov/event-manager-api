export type EventResponse = {
    userId: string | undefined;
    eventId: string | undefined;
    headline: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    location: string;
};