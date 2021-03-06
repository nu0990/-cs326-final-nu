'use strict'
const pgPromise = require('pg-promise')

const pgp = pgPromise({
    connect(client) {
    console.log('Connected to database:', client.connectionParameters.database);
  },disconnect(client) {
    console.log('Disconnected from database:', client.connectionParameters.database);
  }});
  
const username = "postgres";
const password = "admin";
const connection =process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(connection);

async function connectAndRun(task) {
  let connection = null;
  try {
      connection = await db.connect();
      return await task(connection);
  } catch (e) {
      throw e;
  } 
}

// Returns a row from user_table or empty if user does not exist
async function findUser(username) {
  return await db.any("SELECT * FROM user_table WHERE name=$1;",username);
}

// Add a user to the "database"
async function insertUser(name, pwd,email,salt) {
   return await db.none("INSERT INTO user_table VALUES ($1,$2,$3,$4);",[name,pwd,email,salt]);
}

//Save Node to db
async function addNode(uid,node_id,info,nodeName,des){
  return await db.none("INSERT INTO node VALUES ($1,$2,$3,$4,$5);",[node_id,info,uid,nodeName,des]);
}

//Save comment to db
async function addComment(comment_id,node_id,uid,content,date) {
  return await db.none("INSERT INTO comment VALUES ($1,$2,$3,$4,$5)",[comment_id,content,node_id,uid,date])
}
//get all a node
async function Get_ALLNode(){
  return await db.any("SELECT info, description, name, node_id FROM node;");
}
//get comment for a user
async function Get_UserComment(uid){
  return await db.any("SELECT * FROM comment WHERE uid=$1;",uid);
}

//get posted node for a user
async function Get_UserPost(uid){
  return await db.any("SELECT * FROM node WHERE uid=$1;",uid);
}

//get comment for a node
async function Get_NodeComment(nid){
   return await db.any("SELECT * FROM comment WHERE node_id=$1;",nid);
}

//Get user's email
async function Get_email(uid){
  return await db.any("SELECT email FROM user_table WHERE name=$1;",uid);
}

//delete a comment from db
//params:user name
async function DEL_Comment(uid,cid) {
   return await db.none("DELETE FROM comment WHERE uid=$1 AND comment_id=$2;",[uid,cid]);
}

//delete a node from collection
async function DEL_Fav(uid,node_id) {
  
}

//delete a node posted by uid
async function DEL_Node(uid,nid){
  return await db.none("DELETE FROM node WHERE uid=$1 AND node_id=$2;",[uid,nid]);
}

//update user's password
async function Update_pw(uid,pw,salt){
  return await db.none("UPDATE user_table SET password=$1,salt=$2 WHERE name=$3",[pw,salt,uid]);
}

//update user's email
async function Update_email(uid,email){
  return await db.none("UPDATE user_table SET email=$1 WHERE name=$2",[email,uid]);
}

exports.findUser = findUser;
exports.insertUser = insertUser;
exports.DEL_Comment = DEL_Comment;
exports.Update_email = Update_email;
exports.Update_pw = Update_pw;
exports.addNode = addNode;
exports.Get_ALLNode=Get_ALLNode;
exports.addComment=addComment
exports.Get_NodeComment = Get_NodeComment
exports.Get_email = Get_email
exports.Get_UserPost= Get_UserPost
exports.Get_UserComment = Get_UserComment 
exports.DEL_Node = DEL_Node