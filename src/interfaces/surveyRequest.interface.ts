export interface ISurveyRequest {
  contactId: number;
  contactEmailId: string;
  survey: {
    id: number;
  };
  metaData: string;
}