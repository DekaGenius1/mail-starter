import { Form, Formik, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { string, object } from "yup";
import axios from "axios";

const emailComposeSchema = object({
  subject: string().trim().min(3).required("Subject is required"),
  body: string().trim().min(3).required("Body is required"),
  recipients: string()
    .trim()
    .required("Recipients are required")
    .test("are-valid-emails", "One or more emails are invalid", (value) => {
      const emails = value.split(",");
      const emailRegex = /^\S+@\S+\.\S+$/;
      return emails.every((email) => emailRegex.test(email.trim()));
    }),
});

export const ComposeEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = location.state || {
    recipients: "",
    subject: "",
    body: "",
  };

  const sendEmail = async (emailValues, { setSubmitting }) => {
    try {
      await axios.post("/emails", emailValues, {
        withCredentials: true,
      });
      navigate("/c/sent");
    } catch (error) {
      console.error("Failed to send email:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={sendEmail}
        validationSchema={emailComposeSchema}
      >
        {(formik) => (
          <Form
            autoComplete="off"
            className="max-w-md mx-auto flex flex-col gap-4"
          >
            <div>
              <Label className="mb-4 inline-block" htmlFor="recipients">
                Recipients
              </Label>
              <Input
                id="recipients"
                {...formik.getFieldProps("recipients")}
              />
              <ErrorMessage
                name="recipients"
                component="span"
                className="text-red-600"
              />
            </div>
            <div>
              <Label className="mb-4 inline-block" htmlFor="subject">
                Subject
              </Label>
              <Input id="subject" {...formik.getFieldProps("subject")} />
              <ErrorMessage
                name="subject"
                component="span"
                className="text-red-600"
              />
            </div>
            <div>
              <Label className="mb-4 inline-block" htmlFor="body">
                Body
              </Label>
              <Textarea
                rows="15"
                id="body"
                {...formik.getFieldProps("body")}
              />
              <ErrorMessage
                name="body"
                component="span"
                className="text-red-600"
              />
            </div>
            <Button
              className="self-end"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
