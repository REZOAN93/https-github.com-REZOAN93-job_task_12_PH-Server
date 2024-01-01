

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
    const listPerPage = 10;
    const offset = (currentPage - 1) * listPerPage;
  const userId=parseInt(req.query.userId)
    const topics =  await prisma.quizmarks.findMany({
      where: {
         userId: userId,
      },
      skip: offset,
      take: listPerPage,
    });
   
    await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, {
        data: topics,
        meta: {page: currentPage}
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