import { updateChat } from "@chatapp/core/src/database/db-chat";

export async function main(event) {
    try {
        const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId;
        const { id, name } = JSON.parse(event.body);
        const res = await updateChat(id, name, identityPoolUserId);

        return ({
            statusCode: 200,
            body: JSON.stringify({
                message: res > 0 && true,
                error: res < 1 && true
            }),
        });
    } catch(error) {
        console.log("###ERROR on updateChat: ", error.message || error);
        return({
            error: true,
            message: "ERROR on updateChat"
        });
    }
  }
  