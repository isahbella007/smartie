const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function startApp() {
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running");
}
startApp();

// Get the users message from slack
app.message(async ({ message, say }) => {
  const text = message.text;
  console.log("user input => ", text);
  const gtpResponse = await getGptAnswer(text);
  await say(
    `Hey <@${message.user}>! ${gtpResponse}`
  );
});

console.log("---------------------------------");

async function getGptAnswer(text) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{ role: "user", content: text }],
  });
  return completion.data.choices[0].message.content;
}
