export interface ISurveyRequest {
  contactId: number;
  contactName: string;
  contactEmailId: string;
  phone: number;
  survey: {
    id: number;
  };
  metaData: string;
}