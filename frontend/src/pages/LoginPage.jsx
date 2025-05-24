import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/components/AuthContext";
import { formatDate } from "@/lib/utils";
import axios from "axios"; 

export const Email = () => {
  const { emailCategory, emailId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const deleteEmail = async () => {
    try {
      await axios.delete(`/emails/${emailId}`, { withCredentials: true });
      navigate("/c/inbox"); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const reply = () => {
    navigate("/compose", {
      state: {
        recipients: [email.sender, ...email.recipients]
          .filter((r) => r.email !== user.email)
          .map((r) => r.email)
          .join(","),
        subject: `Re: ${email.subject}`,
        body: `\n\n----\non ${formatDate(email.sentAt)}, ${
          email.sender.email
        } wrote:\n\n${email.body}`,
      },
    });
  };

  const toggleArchive = async () => {
    try {
      await axios.patch(
        `/emails/${emailId}`,
        { archived: !email.archived },
        { withCredentials: true }
      );
      setEmail((prev) => ({
        ...prev,
        archived: !prev.archived,
      }));
    } catch (err) {
      console.error("Archive toggle failed:", err);
    }
  };

  const formatTextWithNewlines = (text) => {
    return text?.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/emails/${emailId}`, {
          withCredentials: true,
        });
        setEmail(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetching email failed:", err);
      }
    };

    fetchEmail();
  }, [emailId]);

  if (loading) return null;

  return (
    <div>
      <div>
        <h2 className="font-medium text-3xl">{email.subject}</h2>
        <Badge className="my-4">{emailCategory}</Badge>
        <ul className="pb-4 border-b flex flex-col gap-2">
          <li>
            <span className="font-bold">From:</span>{" "}
            <span>{email.sender?.email}</span>
          </li>
          <li>
            <span className="font-bold">To:</span>{" "}
            <span>{email.recipients.map((r) => r.email).join(", ")}</span>
          </li>
          <li>
            <span>{formatDate(email.sentAt)}</span>
          </li>
        </ul>
        <p className="my-4">{formatTextWithNewlines(email.body)}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reply} variant="outline">
          Reply
        </Button>
        {emailCategory !== "sent" && (
          <Button onClick={toggleArchive} variant="outline">
            {email.archived ? "Unarchive" : "Archive"}
          </Button>
        )}
        <Button onClick={deleteEmail} variant="outlineDestructive">
          Delete
        </Button>
      </div>
    </div>
  );
};
