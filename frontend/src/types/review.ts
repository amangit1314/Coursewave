import { Course } from "./course-details-api-response"

export type Review = {
  id:        String  
  rating:    Number
  comment:   String
  userId  :  String
  courseId : String
  createdAt :Date 
  updatedAt :Date 
  course    : Course   
//   user     : User     
}