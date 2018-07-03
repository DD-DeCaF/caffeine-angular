export interface Configuration {
  production: boolean;
  apis: {
    iam: string;
    model: string;
  };
  GATrackingID?: string;
  sentryDSN?: string;
  firebase: {
    api_key: string;
    auth_domain: string;
    database_url: string;
    project_id: string;
    storage_bucket: string;
    sender_id: string;
  };
  trustedURLs: string[];
}
