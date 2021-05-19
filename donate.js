import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

async function sendDonation(data, hasCode) {
      var axios = require("axios");
      var dataPost = {'name':data.name,'identifier':data.name,'amount':data.amount,'currency':data.currency,'access_token':hasCode.Item.access_token};
      if(data.message){
        dataPost['message'] = data.message;
      }
      const res = await axios.post('https://streamlabs.com/api/v1.0/donations', dataPost);
      console.log(res);
      return{body:res.data.donation_id};
    }

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  var params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":'{"address":"'+data.walletAddress+'"}'
    },
    KeyConditionExpression: "walletAddress = :wa",
    ExpressionAttributeValues:{
      ":wa" : '{"address":"'+data.walletAddress+'"}'
    },
    ProjectionExpression:"access_token"

  };
  try{
    const hasCode = await dynamoDb.get(params);
    console.log(hasCode);
    const sendIt = await sendDonation(data, hasCode);
    return ({Donation: true, Response: sendIt});
  } catch (e) {
    console.log(e);
    return { Donation: false };
  }
});