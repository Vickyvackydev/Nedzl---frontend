import React, { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { API } from "../../config";

function Newsletter() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please provide both subject and message");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/admin/newsletter", {
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(response?.data?.message || "Newsletter broadcast started successfully!");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-5 geist-family w-full flex flex-col items-start gap-y-5">
        <h1 className="text-2xl font-bold text-primary-300">Newsletter</h1>

        <div className="w-full bg-white rounded-xl p-5 border border-borderColor flex flex-col gap-y-4 shadow-sm">
          <h2 className="text-lg font-medium text-primary-300">Send Bulk Email to All Active Users</h2>
          <p className="text-sm text-[#75757A] -mt-2">
            Draft your updates and notify everyone on the platform. Keep your users updated with the latest news, announcements, or features.
          </p>

          <form onSubmit={handleSend} className="flex flex-col gap-y-4 w-full">
            <div className="flex flex-col w-full gap-y-1">
              <label className="text-sm font-medium text-[#4F5762]">Subject</label>
              <input
                type="text"
                placeholder="e.g. Nedzl Marketplace Updates"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-[40px] rounded-lg px-3 border border-borderColor bg-transparent placeholder:text-sm text-primary-300 outline-none focus:border-global-green transition-colors"
                required
              />
            </div>

            <div className="flex flex-col w-full gap-y-1">
              <label className="text-sm font-medium text-[#4F5762]">Message Content</label>
              <textarea
                placeholder="Write your email content here."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full rounded-lg p-3 border border-borderColor bg-transparent placeholder:text-sm text-primary-300 outline-none focus:border-global-green transition-colors resize-y"
                required
              />
            </div>

            <div className="flex justify-end mt-2">
              <Button
                title="Send Newsletter"
                loading={loading}
                disabled={loading}
                btnStyles="bg-global-green rounded-lg px-6 h-[40px]"
                textStyle="text-white text-sm font-medium"
                type="submit"
                handleClick={() => { }}
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Newsletter;
