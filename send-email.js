import { EmailClient } from "@azure/communication-email";
import dotenv from "dotenv";

dotenv.config();
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);


export async function main({ip,location,dateOfVisit,browser,device}) {
  // Create a new email message
  console.log(dateOfVisit)
    const POLLER_WAIT_TIME = 10
    try {
      const emailMessage = {
        senderAddress: "DoNotReply@fe701d14-817d-4da2-8bd8-7515ae28c6c0.azurecomm.net",
          content: {
              subject: "New User",
              plainText: "Hello world via email.",
              html: `
                <html lang="en">
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                <h1 style="color: #444444; margin: 0;">User Entered Your Website</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin-bottom: 20px;">We detected a new user. Here are the details:</p>
                                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="border: 1px solid #dddddd; background-color: #f8f8f8;"><strong>IP Address:</strong></td>
                                        <td style="border: 1px solid #dddddd;">${ip}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dddddd; background-color: #f8f8f8;"><strong>Location:</strong></td>
                                        <td style="border: 1px solid #dddddd;">${location}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dddddd; background-color: #f8f8f8;"><strong>Date of Visit:</strong></td>
                                        <td style="border: 1px solid #dddddd;">${dateOfVisit}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dddddd; background-color: #f8f8f8;"><strong>Browser:</strong></td>
                                        <td style="border: 1px solid #dddddd;">${browser}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dddddd; background-color: #f8f8f8;"><strong>Device:</strong></td>
                                        <td style="border: 1px solid #dddddd;">${device}</td>
                                    </tr>
                                </table>
                                <p style="margin-top: 20px;">If this was you, no further action is required. If you don't recognize this activity, please contact our support team immediately.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                                <p>&copy; 2024 AnasBeast. All rights reserved.</p>
                                <p>Rock Paper Scissors</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
              `,
          },
          recipients: {
              to: [{ address: "<boussehminea@gmail.com>" }],
          },
          
      };
  
      const poller = await emailClient.beginSend(emailMessage);
  
      if (!poller.getOperationState().isStarted) {
        throw "Poller was not started."
      }
  
      let timeElapsed = 0;
      while(!poller.isDone()) {
        poller.poll();
        console.log("Email send polling in progress");
  
        await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;
  
        if(timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw "Polling timed out.";
        }
      }

      if(poller.getResult().status === "Succeeded") {
        console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
      }
      else {
        throw poller.getResult().error;
      }
    } catch (e) {
      console.log(e);
    }
}