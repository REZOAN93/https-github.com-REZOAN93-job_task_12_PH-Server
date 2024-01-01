
const express = require("express");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const router = express.Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', async (req:any, res:any) => {
  
    const {email,password,userName,isAdmin}=req.body;
  
    if (!email) {
      return res.status(400).json({message: 'Either quote or author is missing'});
    }
    try {
      const message = 'User created successfully';
      const user = await prisma.user.findFirst({
        where: {email: email }
      });
  
      if(!user) {
       const data= await prisma.user.create({ 
          data: {
            "isAdmin":isAdmin,
            "userName" :userName,
            "email":email,
            "position":"",
            "institution" :"",
            "password" :password
          }
        });
        // return res.json({message});
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_CREATED_SUCCESSFULLY, {
          data: data,
        })      
      }else{
        return  responseHandler.sendError(req, res, CONSTANTS.MESSAGES.RECORD_ALREADY_EXISTS)
      }
    } catch(e:any) {
      const message=e?.message? e.message:'Something Went wrong'
     responseHandler.sendError(req, res, message)
    }
  });
router.post('/login', async (req:any, res:any) => {
    
    const {email,password}=req.body;
  
    if (!email || !password) {
      await responseHandler.sendError(req, res, 'Either email or password is missing')
    }
    try {
      const user = await prisma.user.findFirst({
        where: {email: email ,password:password}
      });
      if(!user) {
        return  responseHandler.sendError(req, res, "Unauthenticated User")
      }else{
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_CREATED_SUCCESSFULLY, {
          data: user,
        })      
      }
    } catch(e:any) {
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

