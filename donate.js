import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

async function sendDonation(data, hasCode) {
      var axios = require("axios");
      const res = await axios.post('https://streamlabs.com/api/v1.0/donations?name='+data.name+'&identifier='+data.name+'&amount='+data.amount+'&currency='+data.currency+'&access_token='+hasCode.access_token);
      console.log(res);
      return{body:JSON.stringify(res)};
    }

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  var params = {
    TableName: `customerTable`,
    KeyConditionExpression: "walletAddress = :wa",
    ExpressionAttributeValues:{
      ":wa" : {"S": data.token}
    },
    Select:"access_token"

  };
  try{
    const hasCode = await dynamoDb.get(params);
    const sendIt = await sendDonation(data, hasCode);
    return ({Donation: true, Response: sendIt});
  } catch (e) {
    console.log(e);
    return { Donation: false };
  }
});