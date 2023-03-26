import { createChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const username = event.requestContext.authorizer?.jwt.claims.username;

    try {
        const { name } = JSON.parse(event.body);
        const newChat = await createChat(name, sub, username);
    
        return ({
            statusCode: 200,
            body: JSON.stringify({
            message: newChat,
            sub,
            username
            }),
        });
    } catch(error) {
        console.log("###ERROR on addChat: ", error.message || error);
        return({
            error: true,
            message: "ERROR on addChat"
        });
    }
  }
  