import { Router } from "express"
import {
  archiveEmail,
  createEmail,
  deleteEmail,
  getEmail,
  getEmailCategory
} from "../controllers/emailControllers.js"
import { protectRoute, validateBody } from "../middleware.js"
import { emailComposeSchema } from "../schema.js" 

export const emailRouter = Router()

emailRouter.post(
  "/",
  protectRoute,
  validateBody(emailComposeSchema),
  createEmail
)

emailRouter.get("/c/:mailbox", protectRoute, getEmailCategory)
emailRouter.get("/:emailId", protectRoute, getEmail)
emailRouter.patch("/:id", protectRoute, archiveEmail)
emailRouter.delete("/:id", protectRoute, deleteEmail)
