import { v5 as uuidv5 } from 'uuid';
import { createHash } from 'crypto';
import nodemailer from 'nodemailer';
import {
  SURVEY_DOMAIN,
  SENDER_EMAIL,
  SENDER_APP_PASSWORD,
  SENDER_APP_USERNAME
} from '../constants/survey.constants';

export async function generateSurveyLink(email: string, surveyId: number): Promise<string> {
  // Generate a UUID for the survey link using surveyId as namespace
  const uuid = uuidv5(email, uuidv5.URL);

  // Combine UUID and salt to create a hash
  const hash = createHash('sha256').update(uuid + email + surveyId).digest('hex');

  // Truncate the hash to 8 digits
  const truncatedHash = hash.slice(0, 8);

  // Construct the survey link with the truncated hash
  const surveyLink = SURVEY_DOMAIN + truncatedHash

  return surveyLink;
}


export async function sendNotificationEmail(contactEmail: string, surveyLink: string): Promise<void> {
  try {
    // Create a SMTP transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_APP_USERNAME,
        pass: SENDER_APP_PASSWORD
      }
    });

    // Email template
    const mailOptions = {
      from: SENDER_EMAIL,
      to: contactEmail,
      subject: 'Survey Notification',
      text: `Dear user,\n\nPlease click on the following link to complete the survey:\n${surveyLink}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Notification email sent successfully!');
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}
