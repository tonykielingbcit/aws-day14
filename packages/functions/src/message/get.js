import { getMessagesByChatId } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
  try {
    const { chatId } = event.pathParameters;
    // console.log("chatID::::::: ", chatId)
    const allMessagesByChat = await getMessagesByChatId(chatId);
  // console.log("allMessagesByChat::::::: ", allMessagesByChat)
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

