require("dotenv").config();
const { PUBLIC_DATA } = require("./constant");
const app = require("./src/app"); 
const { ConnectDB } = require("./src/config/db.config");

// Connect to database first, then start server
ConnectDB().then(() => {
  app.listen(PUBLIC_DATA.port, () => {
    console.log(`the app is listen at http://localhost:${PUBLIC_DATA.port}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});