import { createChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;
    // const username = event.requestContext.authorizer?.jwt.claims.username;

    // instead, now we are going to use this info
    // also it's gonna be the user id in DB tables for chat and message
    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId
    // Sam will bring the username from Cognito still
    console.log("event.requestContext.authorizer: ", event.requestContext.authorizer)

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
  