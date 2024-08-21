import { APIRequestContext } from "@playwright/test"
import { baseUrl, demogmEndpoints } from "../defaults/config.enums";
import { basicHeaders } from "../data/headersData";
import { postIssuePayload } from "../data/payloadData";

export class PostIssueService {
    worker: any;
    request: APIRequestContext;
    constructor(request: APIRequestContext, worker: any) {
        this.request = request;
        this.worker = worker;
    };
 
    async postIssue() {
        const URL = `${baseUrl.Api}${demogmEndpoints.postIssue}`;
        const res = await this.request.post(URL, {
            headers: basicHeaders,
            data: postIssuePayload
        });
        return res;
    }
}