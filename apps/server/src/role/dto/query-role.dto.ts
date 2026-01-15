export class QueryDto {
    current: number;
    pageSize: number;
    name?: string;
    code?: string;
    status?: number;
    startTime?: Date;
    endTime?: Date;
}
