import asyncHandler from "express-async-handler"
import { Email, User } from "../models.js"

export const createEmail = asyncHandler(async (req, res) => {
  const { recipients, subject, body } = req.body
  const emails = recipients.split(",").map(email => email.trim())
  const recipientUsers = await User.find({ email: { $in: emails } })

  const email = await Email.create({
    sender: req.user._id,
    recipients: recipientUsers.map(user => user._id),
    subject,
    body
  })

  res.status(201).json({ message: "Email sent successfully.", _id: email._id })
})

export const getEmailCategory = asyncHandler(async (req, res) => {
  const { mailbox } = req.params
  let emails

  switch (mailbox) {
    case "inbox":
      emails = await Email.find({
        archived: false,
        recipients: req.user._id
      })
        .sort({ createdAt: -1 })
        .populate("sender", "email")
        .populate("recipients", "email")
      break

    case "sent":
      emails = await Email.find({
        sender: req.user._id
      })
        .sort({ createdAt: -1 })
        .populate("sender", "email")
        .populate("recipients", "email")
      break

    case "archived":
      emails = await Email.find({
        archived: true,
        recipients: req.user._id
      })
        .sort({ createdAt: -1 })
        .populate("sender", "email")
        .populate("recipients", "email")
      break

    default:
      return res.status(400).json({ error: "Invalid mailbox" })
  }

  res.json(emails)
})

export const getEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.params

  const email = await Email.findOne({
    _id: emailId,
    $or: [
      { recipients: req.user._id },
      { sender: req.user._id }
    ]
  })
    .populate("sender", "email")
    .populate("recipients", "email")

  if (!email) {
    return res.status(404).json({ message: "Email not found" })
  }

  res.json(email)
})

export const archiveEmail = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { archived } = req.body

  const email = await Email.findById(id)

  if (!email) {
    return res.status(404).json({ message: "Email not found" })
  }

  if (!email.recipients.includes(req.user._id)) {
    return res.status(403).json({ message: "Not authorized to archive this email" })
  }

  email.archived = archived
  await email.save()

  res.json({ message: `Email ${archived ? "archived" : "unarchived"}` })
})

export const deleteEmail = asyncHandler(async (req, res) => {
  const { id } = req.params

  await Email.findOneAndDelete({
    _id: id,
    $or: [
      { recipients: req.user._id },
      { sender: req.user._id }
    ]
  })

  res.sendStatus(204)
})
