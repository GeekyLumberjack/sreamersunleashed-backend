import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item:{walletAddress:data.walletAddress,
      TokenMap:data.tokenMap},
      ConditionExpression: 'attribute_exists(walletAddress)',
  };

  try {
    const result = await dynamoDb.update(params); // Return the matching list of items in response body
    return {TokenMap: true, result:result};
  } catch (e) {
    console.log(e);
    return { TokenMap: false };
  }
});