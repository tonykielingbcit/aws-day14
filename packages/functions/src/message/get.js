import { getMessagesByChatId } from "@chatapp/core/src/database/db-message";

export async function main(event) {
  try {
        const { chatId } = event.pathParameters;
        const allMessagesByChat = await getMessagesByChatId(chatId);
        
        return ({
        statusCode: 200,
        body: JSON.stringify({
            message: allMessagesByChat
        }),
        });
  } catch(error) {
        console.log("###ERROR on getAllChats: ", error.message || error);
        return({
            error: true,
            message: "ERROR on getAllChats"
        });
  }
}

