export interface ISurveyRequest {
  contactId: number;
  contactEmailId: string;
  survey: {
    id: number;
  };
  surveyName: string;
  metaData: string;
}