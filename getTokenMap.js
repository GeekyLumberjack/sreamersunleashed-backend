import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";


export const main = handler( async (event, context) => {
  const walletAddress = event['pathParameters']['walletAddress'];
  var params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":'{"address":"'+walletAddress+'"}'
    },
    KeyConditionExpression: "walletAddress = :wa",
    ExpressionAttributeValues:{
      ":wa" : '{"address":"'+walletAddress+'"}'
    },
    ProjectionExpression:"tokenMap"

  };
  try{
    const map = await dynamoDb.get(params);
    console.log(map);
    return ({Map: true, Response: donate});
  } catch (e) {
    console.log(e);
    return { Map: false };
  }
});