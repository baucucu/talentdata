import * as Realm from "realm-web";
const app = new Realm.App({ id: "talentdata-wqdfe" });
console.log("app: ", app)
const email = "alexandru.raduca@gmail.com";
const password = "talentData1@"

async function loginEmailPassword(email, password) {
    // Create an anonymous credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user = await app.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      return user
    } catch(err) {
      console.error("Failed to log in", err);
    }
} 

loginEmailPassword(email, password).then(user => {
    console.log("Successfully logged in!", user)
})

const mongodb = app.currentUser.mongoClient("mongodb-atlas");

export default mongodb