import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item:{code:data.code}
  };

  try {
    const result = await dynamoDb.put(params); // Return the matching list of items in response body

    return result.Items;
  } catch (e) {
    console.log(e);
    return { status: false };
  }
});