import { updateMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;

    try {
        const { chatId, content } = JSON.parse(event.body);
        const res = await updateMessage(chatId, content, sub);
        
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
  