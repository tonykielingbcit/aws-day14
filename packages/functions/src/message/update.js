import { updateMessage } from "@chatapp/core/src/database/db-message";

export async function main(event) {
    try {
        const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId;
        const { chatId, content } = JSON.parse(event.body);
        const res = await updateMessage(chatId, content, identityPoolUserId);
        
        return ({
            statusCode: 200,
            body: JSON.stringify({
                message: res > 0 && true,
                error: res < 1 && true
            }),
        });
    } catch(error) {
        console.log("###ERROR on updateMessage: ", error.message || error);
        return({
            error: true,
            message: "ERROR on updateMessage"
        });
    }
  }
  