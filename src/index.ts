import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import { Handler } from 'aws-lambda';

const region = process.env.BUCKET_REGION;
const functionName = process.env.FUNCTION_NAME;

const lambdaClient = new LambdaClient({ region: "your-region" });

export const handler: Handler = async (event, context) => {
    // Get the object from the event and show its content type
    const s3Event = event.Records[0].Sns.Message;
    const s3EventJson = JSON.parse(s3Event);
    const bucket = s3EventJson.Records[0].s3.bucket.name;
    const key = decodeURIComponent(s3EventJson.Records[0].s3.object.key.replace(/\+/g, ' '));

    try {
        const updateCodeCommand = new UpdateFunctionCodeCommand({
            FunctionName: functionName,
            S3Bucket: bucket,
            S3Key: key,
            Publish: true
        });

        const response = await lambdaClient.send(updateCodeCommand);
        console.log("Lambda function updated:", response);
        return response;
    } catch (err) {
        const message = `Error updating lambda ${functionName} from bucket ${bucket}.`;
        throw new Error(message);
    }
};
