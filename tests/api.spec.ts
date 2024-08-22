import { gamdom } from "../fixtures/gamdom.fixture";
import { expect } from "@playwright/test";
import { baseUrl, demogmEndpoints } from "../defaults/config.enums";
import { basicHeaders } from "../data/headersData";
import { editIssuePayload } from "../data/payloadData";

gamdom.describe("api fixture", () => {
  let issueId: string;

  gamdom("Get issue by id; @get @api", async ({ request, api }) => {
    const createJiraIssueResponse = await api.postIssue()
    const createJiraIssueResponseBody = await createJiraIssueResponse.json();
    issueId = createJiraIssueResponseBody.id;

    const getIssueByIdResponse = await request.get(`${baseUrl.Api}${demogmEndpoints.getSpecificIssue}${issueId}`,{
        headers: basicHeaders,
      }
    );
    const getIssueByIdResponseBody = await getIssueByIdResponse.json();
    expect(getIssueByIdResponse.status()).toBe(200);
    expect(getIssueByIdResponseBody).toHaveProperty("id", issueId);
  });
  gamdom.skip("Post issue; @post @api", async ({ api }) => {
    const createJiraIssueResponse = await api.postIssue()
    const createJiraIssueResponseBody = await createJiraIssueResponse.json();
    issueId = createJiraIssueResponseBody.id;

    expect(createJiraIssueResponse.status()).toBe(201);
    expect(createJiraIssueResponseBody).toHaveProperty("id", issueId);
    expect(createJiraIssueResponseBody.key).toMatch(/^[A-Z]+-\d+$/);
  });
  gamdom.skip("Edit issue; @edit @api", async ({ api, request }, worker) => {
    const createJiraIssueResponse = await api.postIssue()
    const createJiraIssueResponseBody = await createJiraIssueResponse.json();
    issueId = createJiraIssueResponseBody.id;

    const editIssueResponse = await request.put(`${baseUrl.Api}${demogmEndpoints.editIssue}${issueId}`,{
      headers: basicHeaders,
      data: editIssuePayload
    }
   );
    expect(editIssueResponse.status()).toBe(204);
  });
  gamdom.skip("Delete issue; @delete @api", async ({ api, request }) => {
    const createJiraIssueResponse = await api.postIssue()
    const createJiraIssueResponseBody = await createJiraIssueResponse.json();
    issueId = createJiraIssueResponseBody.id;
    
    const deleteIssueResponse = await request.delete(`${baseUrl.Api}${demogmEndpoints.deleteIssue}${issueId}`,{
      headers: basicHeaders,
    }
   );
    expect(deleteIssueResponse.status()).toBe(204);
  });
});
