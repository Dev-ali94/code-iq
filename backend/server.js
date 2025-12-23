import { ENV } from "./src/lib/env.js";
import app from "./src/app.js"
import { connectDB } from "./src/lib/db.js";
connectDB();


app.listen(ENV.PORT, () => {
  console.log(`Example app listening on port ${ENV.PORT}`)
})