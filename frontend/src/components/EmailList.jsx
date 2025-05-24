import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const EmailList = ({ emailCategory }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmails = async () => {
    try {
      const res = await fetch(`/emails/c/${emailCategory}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch emails");
      const data = await res.json();
      setEmails(data);
    } catch (e) {
      console.error(e);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (id) => {
    try {
      const res = await fetch(`/emails/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete email");
      await fetchEmails();
      navigate("/c/inbox");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEmails();
  }, [emailCategory]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="my-4 divide-y">
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : emails.length === 0 ? (
        <h2 className="my-6">No emails</h2>
      ) : (
        emails.map((email) => (
          <div className="py-3 gap-4" key={email._id}>
            <div className="flex gap-4 items-center">
              <Link
                to={`/c/${emailCategory}/${email._id}`}
                className="flex justify-between grow gap-4"
              >
                <div className="font-medium hidden md:block">
                  {email.sender?.email || "Unknown"}
                </div>
                <div className="truncate">{email.subject}</div>
                <div className="hidden md:block">
                  {formatDate(email.createdAt)}
                </div>
              </Link>
              <div>
                <Button
                  className="p-2 flex items-center h-auto"
                  variant="outlineDestructive"
                  onClick={() => deleteEmail(email._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
