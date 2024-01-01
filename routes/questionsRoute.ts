import { IQuestion, Option } from "../utils/dataType";

const express = require("express");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const router = express.Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/addQuestion', async (req:any, res:any) => {
    const {title,options,categoryId}=req.body;
    if (!title ||!options) {
      await responseHandler.sendError(req, res, 'Either title or options is missing')
    }
    try {
      const question= await prisma.question.findFirst({
        where: {title:title }
      });
  
      if(!question) {
        const newTopic = await prisma.question.create({
          data: {
                title: title, 
                categoryId:categoryId,
                options: {
                  create: options
                },
          },
        });
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, newTopic)      
      }else{
        return  responseHandler.sendError(req, res, CONSTANTS.MESSAGES.RECORD_ALREADY_EXISTS)
      }
    }  catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
     responseHandler.sendError(req, res, message)
    }
});
router.post('/updateQuestion/:id', async (req:any, res:any) => {
  const id=parseInt(req.params.id)
  const {title,options,categoryId}=req.body;
  if (!title ||!options) {
    await responseHandler.sendError(req, res, 'Either title or options is missing')
  }
  try {
    const question= await prisma.question.findFirst({
      where: {id:id }
    });
    const updatedOptions=[];
    for(let i=0;i<options.length;i++){
      updatedOptions.push({title:options[i].title,isCorrect:options[i].isCorrect})
    }
    
    if(question) {
     const data= await prisma.option.deleteMany({
        where: { questionId:id }
      });
      const newTopic = await prisma.question.update({
        where: {id:id },
        data: {
          title,           
          categoryId,        
          options: {
            create: updatedOptions,  
          }
        },
      });
      await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_UPDATED_SUCCESSFULLY, newTopic)      
    }else{
      return  responseHandler.sendError(req, res, "record not exist")
    }
  }  catch(e:any) {
    const message=e?.message? e.message:'Something Went wrong'
   responseHandler.sendError(req, res, message)
  }
});
router.get('/deleteQuestion/:id', async (req:any, res:any) => {
  const id=parseInt(req.params.id)
  if (!id) {
    await responseHandler.sendError(req, res, 'Either title or options is missing')
  }
  try {
    const question= await prisma.question.findFirst({
      where: {id:id }
    });
    
    if(question) {
      await prisma.option.deleteMany({
        where: { questionId:id }
      });
      const data= await prisma.question.deleteMany({
          where: { id:id }
      });
      await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_UPDATED_SUCCESSFULLY, data);      
    }else{
      return  responseHandler.sendError(req, res, "record not exist")
    }
  }  catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
      responseHandler.sendError(req, res, message)
  }
});
router.get('/', async (req:any, res:any) => {
  try{
    const currentPage = req.query.page || 1;
    const categoryId = req.query.category?parseInt(req.query.category):1;
    const listPerPage = 10;
    const offset = (currentPage - 1) * listPerPage;
  
    const topics =  await prisma.question.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        options: true,
      },
    
      skip: offset,
      take: listPerPage,
    });
 

    const updatedQuestions:IQuestion[]=[];
    const questionids:number[]=[]
      topics.map((question:IQuestion) => {
        const updatedOptions:Option[]=[]
        questionids.push(question.id)
        question?.options?.map(option=>{
          const newOption={...option,isCorrect:false};
          updatedOptions.push(newOption)
        })
        updatedQuestions.push({...question,options:updatedOptions})
  
    });
    await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, {
        data: updatedQuestions,
        questionIds:questionids,
        categoryId:categoryId,
        meta: {page: currentPage}
      })    
    }
    catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
     responseHandler.sendError(req, res, message)
    }  
  });
router.get('/:id', async (req:any, res:any) => {
    const id=parseInt(req.params.id)
  
    const topics =  await prisma.question.findMany({
      where: {
      id:id
      },
      include: {
        options: true,
      },
    });
  

    await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, {
        data:topics
      })      
  });
  router.get('/admin/list', async (req:any, res:any) => {
    try{
      const categoryId = req.query.category?parseInt(req.query.category):1;
      const topics =  await prisma.question.findMany({
        where: {
          categoryId: categoryId,
        },
        include: {
          options: true,
        },
      });
      const updatedQuestions:IQuestion[]=[];
      const questionids:number[]=[]
        topics.map((question:IQuestion) => {
          const updatedOptions:Option[]=[]
          questionids.push(question.id)
          question?.options?.map(option=>{
            const newOption={...option,isCorrect:false};
            updatedOptions.push(newOption)
          })
          updatedQuestions.push({...question,options:updatedOptions})
    
      });
      await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, {
          data: updatedQuestions,
          questionIds:questionids,
          categoryId:categoryId,
        })      
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