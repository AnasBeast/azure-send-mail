import express from 'express';
import { main as sendEmail } from './send-email.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/send-email', async (req, res) => {
    const { ip, location, dateOfVisit, browser, device } = req.body;
    console.log(dateOfVisit);
    try {
        await sendEmail({ ip, location, dateOfVisit, browser, device });
        res.status(200).send('Email sent successfully');
    } catch (error) {
        res.status(500).send('Failed to send email');
    }
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

// export the app for vercel serverless functions
export default app;