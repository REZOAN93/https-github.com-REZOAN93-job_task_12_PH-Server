
const express = require("express");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const router = express.Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req:any, res:any) => {
    try{
        const currentPage = req.query.page || 1;
        const listPerPage = 5;
        const offset = (currentPage - 1) * listPerPage;
        
        const categories =  await prisma.category.findMany({
          skip: offset,
          take: listPerPage,
        });
        
        res.json({
          data: categories,
          meta: {page: currentPage}
        });
    }
     catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
     responseHandler.sendError(req, res, message)
    }
  });

router.post('/add', async (req:any, res:any) => {
  
    const {title,description,}=req.body;
  
    if (!title ||!description) {
      await responseHandler.sendError(req, res, 'Either title or description is missing')
    }
    try {
      const message = 'Topic is  created successfully';
      const question= await prisma.category.findFirst({
        where: {title:title,description:description }
      });
  
      if(!question) {
        const newTopic = await prisma.category.create({
          data: {
                title: title, 
               description:description
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
  export default router