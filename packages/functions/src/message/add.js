import { createMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const username = event.requestContext.authorizer?.jwt.claims.username;

    try {
        const { chatId, content } = JSON.parse(event.body);
        const res = await createMessage(chatId, content, sub, username);
        
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
  