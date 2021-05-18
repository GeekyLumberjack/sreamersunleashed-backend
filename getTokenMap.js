import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";
import {web3Service} from '@unlock-protocol/unlock-js'

async function enrich(map, address){
  for(var i=0;i<map.length;i++){
    var getLockPrice = await web3Service.getTokenBalance(Object.values(map[i])[1], address, 100);
    map[i]['price'] = getLockPrice;
  }
  return map
}

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
    const enrichMap = await enrich(map.Item.tokenMap, walletAddress);
    console.log(map);
    return ({Map: true, Response: enrichMap});
  } catch (e) {
    console.log(e);
    return { Map: false };
  }
});