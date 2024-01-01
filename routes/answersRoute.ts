import { IQuestion, Option } from "../utils/dataType";

const express = require("express");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const router = express.Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async(req:any, res:any) => {
  try{
    const userId=req.body.userId;
    const categoryId=req.body.categoryId
    const desiredIds = req.body.questionIds
    const answers=await req.body.answers.sort(function(x:IQuestion, y:IQuestion){
      return x.id-y.id
    })
    const topics =  await prisma.question.findMany({
      where: {
        categoryId: categoryId,
        id: {
          in: desiredIds, 
        },
      },
      include: {
        options: true
      },
    });
    const filteredTopics = topics.filter((topic:IQuestion) =>
     topic.options.some((option) => option.isCorrect)
    );
  
    console.log(filteredTopics,"filtered topi\cs")
    let totalNumbers=0;
      filteredTopics.map((question:IQuestion,index:number) => {
        let isAnswerCorrect=true;
        question.options.map(questionAnsOpt=>{
          if(answers[index]){
            answers[index].options.map((answerOption:Option)=>{
              if(answerOption.id==questionAnsOpt.id){
                  if(answerOption.isCorrect !== questionAnsOpt.isCorrect){
                    isAnswerCorrect=false
                  }
                }
            })
          }
        })
        if(isAnswerCorrect){
          totalNumbers=totalNumbers+1;
        }
    });
    const categories =  await prisma.category.findMany({
      where: {
        id: categoryId,
      },
    });

    await prisma.quizmarks.create({
          data: {
            userId:userId,
            categoryId:categoryId,
            marks:totalNumbers,
            categoryTitle:categories?.length>0?categories[0].title:'',
            categoryDescription:categories?.length>0?categories[0].description:'',
          },
    });
   

    await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, {
        data: totalNumbers,
        filteredTopics:filteredTopics,
      });
    }
  catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
     responseHandler.sendError(req, res, message)
  }
});
router.get("*", function (req:any, res:any) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.post("*", function (req:any, res:any) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.put("*", function (req:any, res:any) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.patch("*", function (req:any, res:any) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.delete("*", function (req:any, res:any) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
export default router;