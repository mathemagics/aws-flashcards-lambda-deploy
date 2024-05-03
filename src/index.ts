import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import { Handler } from 'aws-lambda';

const functionName = process.env.FUNCTION_NAME;
const region = process.env.REGION_NAME;

const lambdaClient = new LambdaClient({ region });

export const handler: Handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    console.log(`Updating lambda function ${functionName} in region ${region} from bucket ${bucket} with key ${key}`);

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
        const message = `Error updating lambda ${functionName} from bucket ${bucket}. Error: ${err}`;
        throw new Error(message);
    }
};
