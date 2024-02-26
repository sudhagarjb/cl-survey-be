export interface ISurveyRequest {
  contactId: number;
  contactName: string;
  contactEmailId: string;
  phone: string;
  survey: {
    id: number;
  };
  metaData: string;
}