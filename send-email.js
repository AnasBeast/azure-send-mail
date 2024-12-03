const { EmailClient } = require("@azure/communication-email");
require("dotenv").config();

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);

async function main() {
    const POLLER_WAIT_TIME = 10
    try {
      const emailMessage = {
        senderAddress: "DoNotReply@fe701d14-817d-4da2-8bd8-7515ae28c6c0.azurecomm.net",
          content: {
              subject: "Test Email",
              plainText: "Hello world via email.",
              html: `
                <html>
                  <body>
                    <h1>AnasBeast.</h1>
                  </body>
                </html>`,
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
  
main();