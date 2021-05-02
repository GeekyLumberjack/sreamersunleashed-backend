import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  //const data = JSON.parse(event.body);

  try {

    return {status: true};
  } catch (e) {
    console.log(e);
    return { status: false };
  }
});