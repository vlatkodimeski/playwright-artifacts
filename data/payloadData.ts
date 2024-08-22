export const postIssuePayload = {
  fields: {
    assignee: {
      key: "QA",
    },
    description: "test.",
    issuetype: {
      id: "10001",
    },
    labels: ["bugfix", "test"],
    project: {
      id: "10000",
    },
    summary: "Issue creation flow",
  },
};

export const editIssuePayload = {
  fields: {
    assignee: {
      key: "QA",
    },
    description: "test.",
    issuetype: {
      id: "10001",
    },
    labels: ["bugfix", "test"],
    project: {
      id: "10000",
    },
    summary: "Issue edit flow",
  },
};
