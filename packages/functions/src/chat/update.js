import { updateChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    try {
        const { id, name } = JSON.parse(event.body);
        const res = await updateChat(id, name);
        
        return ({
            statusCode: 200,
            body: JSON.stringify({
            message: res
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
  