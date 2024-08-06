interface HttpBodyResponse {
    data: any[];
    details: {
        statusCode: number,
        method: string,
        time: string
    };
    meta: {
        status: HttpBodyResponseMetaStatus,
        message: string
    };
}

enum HttpBodyResponseMetaStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export {
    HttpBodyResponse,
    HttpBodyResponseMetaStatus
}