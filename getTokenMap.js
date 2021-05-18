import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";
import {Web3Service} from '@unlock-protocol/unlock-js';

export const main = handler( async (event, context) => {
  const walletAddress = event['queryStringParameters']['walletAddress'];
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
    return ({Map: true, Response: map});
  } catch (e) {
    console.log(e);
    return { Map: false };
  }
});