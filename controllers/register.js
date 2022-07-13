const bcrypt = require("bcryptjs")
const badReq = require("../error/badReq")
const Datauser = require("../models/User")
const regEx = require("../config/regEx")
require("express-async-errors")
const { StatusCodes } = require("http-status-codes")

const register = async (req, res) => {
  const { email, pwd } = req.body
  if(!email || !pwd) throw new badReq("You need to provide email and password")
 // const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
  const match = regEx.test(email)
  console.log(match)
  if(!match) throw new badReq("Enter a valid email")
  const foundUser = await Datauser.findOne({ email: email }).exec()
  if(foundUser) throw new badReq("Email already used")
  console.log("foundUser")
  const hashpwd = await bcrypt.hash(pwd, 10)
  const result = await Datauser.create({
    email: email,
    password: hashpwd
  })
  console.log(result)
  res.status(StatusCodes.CREATED).json({ result })
}

module.exports = register 