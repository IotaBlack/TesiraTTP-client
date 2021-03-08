const TelnetTTP = require('./dist')
const Assert = require('assert').strict
let client = new TelnetTTP();
client
  .connect({
    host: "192.168.10.110"
  })
  .catch(console.error);
client.on("data", (data) => {
  console.log('data: ' + data.toString());
});

const subscriptionHandlers = {}

subscriptionHandlers["stateSubscription"] = msg => {
  console.log(`logicmeter 1 is now ${JSON.stringify(msg.value)}`);
}

client.on("subscription", msg => {
  let handler = subscriptionHandlers[msg.publishToken]

  if (typeof handler === "function") {
    handler(msg)
  }
})


client.on("ready", () => {
  console.log("ready");

  client
    .send("LogicState toggle state 1")
    .then(msg => { Assert.equal(msg.message, "+OK") })
    .catch(msg => Assert.fail("command 'LogicState toggle state 1' failed:" + msg));

  client
    .send("LogicStdate toggle state 1")
    .then(msg => Assert.fail("command 'LogicStdate toggle state 1' failed:" + msg))
    .catch(msg => Assert.equal(msg.message, '-ERR address not found: {"deviceId":0 "classCode":0 "instanceNum":0}'))

  client.send("LogicMeter1 subscribe states stateSubscription 100")
  client.send("Volume subscribe level 1 vol1 100")

  client.send("DEVICE get activeFaultList").then(msg => {
    console.log(msg)
  }
  )
});
// setTimeout(() => {
//   process.exit()
// }, 5000);
