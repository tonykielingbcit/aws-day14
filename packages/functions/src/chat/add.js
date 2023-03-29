import { createChat } from "@chatapp/core/src/database/db-chat";

export async function main(event) {
    // not for this week:
    // function getUserId(event) {
    //     if (!event.requestContext.authorizer?.iam) {
    //       return 
    //     }
    //     const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr.findLast(ref => ref.includes(':'))
    //     const parts = authProvider.split(':');
    //     return parts[parts.length - 1];
    //   }

    // before working with IAM
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;
    // const username = event.requestContext.authorizer?.jwt.claims.username;

    
    try {
        // const userId = getUserId(event); // not this week
        // instead, now we are going to use this info
        // also it's gonna be the user id in DB tables for chat and message
        const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId;
        // Sam will bring the username from Cognito still

        const { name } = JSON.parse(event.body);
        const newChat = await createChat(name, identityPoolUserId, /*missing username*/ identityPoolUserId);

        return ({
            statusCode: 200,
            body: JSON.stringify({
            message: newChat,
            error: false
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
  