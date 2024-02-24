import { v5 as uuidv5 } from 'uuid';
import { createHash } from 'crypto';
import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';

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

    // Read EJS template file
    const template = fs.readFileSync('src/mailers/surveyEmailTemplate.ejs', 'utf8');

    // Render the template with variables
    const emailContent = ejs.render(template, { surveyLink });

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
      subject: 'Your shopping experience with Caratlane!',
      html: emailContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Notification email sent successfully!');
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}