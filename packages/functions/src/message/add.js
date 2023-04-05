import { createMessage } from "@chatapp/core/src/database/db-message";

export async function main(event) {
    try {
        const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId;
        const { chatId, content, content_type } = JSON.parse(event.body);
        const res = await createMessage(chatId, content, content_type, identityPoolUserId, /*username*/ identityPoolUserId);
        
        return ({
            statusCode: 200,
            body: JSON.stringify({
                message: res,
                error: !res && true
            }),
        });
    } catch(error) {
      console.log("###ERROR on addMessage: ", error.message || error);
      return({
        error: true,
        message: "ERROR on addMessage"
      });
    }
  }
  