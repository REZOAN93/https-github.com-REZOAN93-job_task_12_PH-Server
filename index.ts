import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
require("dotenv").config();
import cors from 'cors';
app.use(cors())
app.get('/', (req, res) => {
  res.json({message: 'alive'});
});
// import questionsRoute from "./routes/questionsRoute";
import usersRoute from "./routes/usersRoute";
import categoriesRoute from "./routes/categoriesRoute";
import answersRoute from "./routes/answersRoute";
import quizRoute from "./routes/quizRoute";
app.set('view engine', 'ejs');
import questionsRoute from './routes/questionsRoute'; 
app.use("/questions",questionsRoute);
app.use("/categories", categoriesRoute);
app.use("/answers", answersRoute);

app.use("/users", usersRoute);
app.use("/quiz", quizRoute);

// app.get('/randomQuestions', async (req, res) => {
//   const currentPage = req.query.page || 1;
//   const categoryId = req.query.category?parseInt(req.query.category):1;
//   const listPerPage = 5;
//   const offset = (currentPage - 1) * listPerPage;
//   const desiredIds = req.query.questionIds
  
//   const topics =  await prisma.question.findMany({
//     where: {
//       categoryId: categoryId,
//       id: {
//         in: desiredIds, 
//       },
//     },
//     include: {
//       options: true,
//     },
  
//     skip: offset,
//     take: listPerPage,
//   });
//   const updatedQuestions=[];
// const questionids=[]
//   topics.map((question) => {
//     const updatedOptions=[]
//     questionids.push(question.id)
//     question?.options?.map(option=>{
//       const newOption={...option,isCorrect:false};
//       updatedOptions.push(newOption)
//     })
//     updatedQuestions.push({...question,options:updatedOptions})

// });
//   res.json({
//     data: updatedQuestions,
//     questionids:questionids,
//     meta: {page: currentPage}
//   });
// });

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
