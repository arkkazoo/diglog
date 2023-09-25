const express = require("express");
const app = express();
const port = 3000;
const digRouter = require("./routes/dig");
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");


app.use(express.json());

app.use('/api/dig', digRouter);
app.use('/api/user', userRouter);
app.use('/api/search', searchRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


