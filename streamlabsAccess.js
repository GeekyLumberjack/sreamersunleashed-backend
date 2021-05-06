import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  var params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":data.walletAddress
    },
    ExpressionAttributeValues:{
      ":c1" : data.code
    },
    UpdateExpression:"set code = :c1"

  };

  try {
    const result = await dynamoDb.update(params); // Return the matching list of items in response body
    return {code: true, result:result};
  } catch (e) {
    if(e.code === 'ConditionalCheckFailedException'){
      return{ code: true};
    }
    console.log(e);
    return { code: false };
  }
});