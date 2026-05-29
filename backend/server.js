const express = require("express"); //!require(express) returns function.
const cors = require("cors");
const sendEmail = require("./util/sendEmail");
// sendEmail("user@gmail.com", "123456");
const app = express();

const usersRouter = require("./routes/users/usersRouter");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");

//!loading environment variable
dotenv.config();

//!extablish connection to db
connectDB();
//!setting up middleware
app.use(express.json());

//!cors middleware
app.use(cors());

//!Setting up router
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);
//!not found error handler
app.use(notFound);

//!setting up global error handler
app.use(globalErrorHandler);

app.listen(process.env.PORT || 9080, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
