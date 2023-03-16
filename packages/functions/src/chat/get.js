import { getChats } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
  try {
    const allChats = await getChats();
  
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: allChats
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

