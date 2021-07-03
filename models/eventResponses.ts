export type EventResponse = {
    userId: string | undefined;
    eventId: string | undefined;
};

export type CreateEventResponse = EventResponse & {
    headline: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    location: string;
};