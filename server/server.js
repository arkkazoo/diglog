const express = require("express");
const CORS = require("cors");
const app = express();
const port = 3000;
const digRouter = require("./routes/dig");
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");
const loginRouter = require("./routes/login");

app.use(CORS());
app.use(express.json());

app.use('/api/dig', digRouter);
app.use('/api/user', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/login', loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
