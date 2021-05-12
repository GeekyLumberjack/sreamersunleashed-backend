import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  var axios = require("axios");
  const data = JSON.parse(event.body);
  var params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":data.walletAddress
    },
    KeyConditionExpression: "walletAddress = :wa",
    ExpressionAttributeValues:{
      ":wa" : data.walletAddress
    },
    ProjectionExpression:"code"

  };
  try{
    const hasCode = await dynamoDb.get(params);
    axios.post('https://streamlabs.com/api/v1.0/donations?name='+data.name+'&identifier='+data.walletAddress+'&amount='+data.amount+'&currency='+data.currency+'&access_token'+hasCode.Item.code)
      .then(function(response){
        console.log(response);
      })
      .catch(function (error) {
        console.log(error)});
    return ({Donation: true});
  } catch (e) {
    console.log(e);
    return { Donation: false };
  }
});