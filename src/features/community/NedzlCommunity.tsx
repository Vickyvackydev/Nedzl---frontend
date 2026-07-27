import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityMessages,
  sendCommunityMessage,
  reactToCommunityMessage,
  CommunityMessage,
} from "../../services/community.service";
import toast from "react-hot-toast";
import {
  FiSend,
  FiMessageSquare,
  FiCornerUpLeft,
  FiX,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/slices/authReducer";
import Modal from "../../components/Modal";

const PRESET_EMOJIS = ["👍", "❤️", "🔥", "👏", "😂", "🚀", "💡"];
const LINK_REGEX = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|ng|org|net|io|edu|gov|co|me|xyz|app|dev))/i;

export default function NedzlCommunity() {
  const currentUser = useSelector(selectUser);
  const queryClient = useQueryClient();
  
  const [displayName, setDisplayName] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [tempNameInput, setTempNameInput] = useState<string>("");

  const [messageText, setMessageText] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<CommunityMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize display name from logged in user or localStorage
  useEffect(() => {
    if (currentUser?.user_name) {
      setDisplayName(currentUser.user_name);
    } else {
      const savedName = localStorage.getItem("nedzl_community_username");
      if (savedName) {
        setDisplayName(savedName);
      } else {
        setShowNameModal(true);
      }
    }
  }, [currentUser]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempNameInput.trim()) {
      toast.error("Please enter a display name to join the community");
      return;
    }
    const cleanName = tempNameInput.trim();
    setDisplayName(cleanName);
    localStorage.setItem("nedzl_community_username", cleanName);
    setShowNameModal(false);
    toast.success(`Welcome to Nedzl Community, ${cleanName}!`);
  };

  // Poll community messages every 3 seconds
  const { data: messagesResponse, isLoading } = useQuery({
    queryKey: ["communityMessages"],
    queryFn: getCommunityMessages,
    refetchInterval: 3000,
  });

  const messages: CommunityMessage[] = messagesResponse?.data || [];

  // Scroll to bottom on new message load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendCommunityMessage,
    onSuccess: () => {
      setMessageText("");
      setReplyToMessage(null);
      queryClient.invalidateQueries({ queryKey: ["communityMessages"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to send message to community"
      );
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName) {
      setShowNameModal(true);
      return;
    }

    const trimmedMsg = messageText.trim();
    if (!trimmedMsg) return;

    // Client-side strict link ban check
    if (LINK_REGEX.test(trimmedMsg)) {
      toast.error(
        "Posting links, URLs or website addresses is strictly prohibited in Nedzl Community!"
      );
      return;
    }

    sendMessageMutation.mutate({
      sender_name: displayName,
      sender_email: currentUser?.email || "",
      message: trimmedMsg,
      reply_to_id: replyToMessage?.id,
    });
  };

  const handleEmojiClick = async (msgId: string, emoji: string) => {
    if (!displayName) {
      setShowNameModal(true);
      return;
    }

    try {
      await reactToCommunityMessage(msgId, {
        emoji,
        sender_name: displayName,
      });
      queryClient.invalidateQueries({ queryKey: ["communityMessages"] });
    } catch {
      toast.error("Failed to react to message");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-6 flex flex-col h-[calc(100vh-40px)] min-h-[750px] geist-family">
      {/* Header */}
      <div className="bg-white border border-borderColor rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-global-green/10 flex items-center justify-center text-global-green">
            <FiMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Nedzl Community</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                LIVE FORUM
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Network with fellow campus marketers & buyers. No links allowed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
            Identity:
          </span>
          <button
            onClick={() => {
              setTempNameInput(displayName);
              setShowNameModal(true);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FiUser size={13} className="text-global-green" />
            <span>{displayName || "Set Name"}</span>
          </button>
        </div>
      </div>

      {/* Warning Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 p-2.5 px-4 rounded-xl mb-3 flex items-center gap-2 text-xs text-amber-900">
        <FiAlertCircle className="text-amber-600 w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Community Guidelines:</strong> Be respectful. Posting links or domain URLs is strictly prohibited to keep Nedzl Community safe & spam-free.
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-white border border-borderColor rounded-2xl p-4 overflow-y-auto custom-scrollbar-gray space-y-4 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            Loading community messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2">
            <FiMessageSquare className="w-10 h-10 text-gray-300" />
            <span className="text-sm font-semibold text-gray-700">No messages yet</span>
            <span className="text-xs text-gray-500">Be the first to start a discussion in Nedzl Community!</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_name === displayName;
            return (
              <div
                key={msg.id}
                className={`group flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] relative ${
                  isMe ? "ml-auto items-end" : "items-start"
                }`}
              >
                {/* Hover Reaction Toolbar */}
                <div
                  className={`hidden group-hover:flex items-center gap-0.5 bg-white p-1 rounded-full shadow-md border border-borderColor text-xs absolute -top-3 z-10 transition-all ${
                    isMe ? "right-2" : "left-2"
                  }`}
                >
                  {PRESET_EMOJIS.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => handleEmojiClick(msg.id, emoji)}
                      className="hover:scale-125 transition-transform px-1"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Sender Header */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 px-1">
                  <span className="font-bold text-gray-800">
                    {msg.sender_name} {isMe && "(You)"}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Quoted Reply if present */}
                {msg.reply_to && (
                  <div className="bg-gray-100 border-l-4 border-global-green p-2 rounded-r-xl text-xs text-gray-600 mb-0.5">
                    <span className="font-bold block text-[10px] text-emerald-800">
                      Replying to {msg.reply_to.sender_name}:
                    </span>
                    <span className="line-clamp-2">{msg.reply_to.message}</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed relative ${
                    isMe
                      ? "bg-global-green text-white rounded-tr-xs"
                      : "bg-gray-100 text-gray-900 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>

                  {/* Reply trigger button */}
                  <button
                    onClick={() => setReplyToMessage(msg)}
                    className={`absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md ${
                      isMe ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                    title="Reply to message"
                  >
                    <FiCornerUpLeft size={12} />
                  </button>
                </div>

                {/* Applied Reaction Badges */}
                {msg.reactions &&
                  Array.isArray(msg.reactions) &&
                  msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-0.5">
                      {msg.reactions.map((r: any, rIdx: number) => (
                        <button
                          key={rIdx}
                          onClick={() => handleEmojiClick(msg.id, r.emoji)}
                          className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold ${
                            r.users?.includes(displayName)
                              ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview Bar */}
      {replyToMessage && (
        <div className="bg-gray-100 border-l-4 border-global-green p-2.5 rounded-t-xl flex items-center justify-between text-xs text-gray-700 mt-2">
          <div className="min-w-0 pr-2">
            <span className="font-bold block text-emerald-800 text-[11px]">
              Replying to {replyToMessage.sender_name}
            </span>
            <span className="truncate block text-gray-600">
              {replyToMessage.message}
            </span>
          </div>
          <button
            onClick={() => setReplyToMessage(null)}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      {/* Input Message Form */}
      <form
        onSubmit={handleSendMessage}
        className={`bg-white border border-borderColor p-3 shadow-md flex items-center gap-2 ${
          replyToMessage ? "rounded-b-2xl" : "rounded-2xl mt-2"
        }`}
      >
        <input
          type="text"
          placeholder={
            displayName
              ? `Message Nedzl Community as ${displayName}...`
              : "Enter display name to join discussion..."
          }
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-gray-900"
        />
        <button
          type="submit"
          disabled={sendMessageMutation.isPending || !messageText.trim()}
          className="bg-global-green hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          <span>Send</span>
          <FiSend size={13} />
        </button>
      </form>

      {/* Display Name Modal */}
      <Modal show={showNameModal} onClose={() => setShowNameModal(false)}>
        <form
          onSubmit={handleSaveName}
          className="p-6 sm:p-8 max-w-lg md:max-w-xl w-full bg-white rounded-3xl flex flex-col gap-y-5 shadow-2xl border border-borderColor geist-family"
        >
          {/* Top Marketing Badge & Header */}
          <div className="flex items-start justify-between border-b border-borderColor pb-4">
            <div className="flex flex-col gap-y-1">
              <span className="w-fit bg-emerald-50 text-global-green border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span>🚀</span> INSTANT CAMPUS FORUM
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2 mt-1">
                <FiUser className="text-global-green w-6 h-6" />
                <span>Join Nedzl Community</span>
              </h3>
            </div>
            {displayName && (
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Subtitle / Value Proposition */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            No registration needed! Choose a display name or brand handle to start networking and chatting with campus buyers & marketers instantly.
          </p>

          {/* Marketing Highlight Pills */}
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3.5 rounded-2xl border border-borderColor text-xs sm:text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-global-green font-bold">✓</span>
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-global-green font-bold">✓</span>
              <span>Live Threaded Replies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-global-green font-bold">✓</span>
              <span>Emoji Reactions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-global-green font-bold">✓</span>
              <span>Spam & Link Protected</span>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-bold text-gray-800">
              Your Display Name / Handle *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TechSeller, Amaka (UNN), CampusMarketer"
              value={tempNameInput}
              onChange={(e) => setTempNameInput(e.target.value)}
              className="w-full px-4 py-3.5 text-base border border-borderColor rounded-2xl focus:outline-none focus:ring-2 focus:ring-global-green/20 focus:border-global-green transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* CTA Button */}
          <div className="pt-3 border-t border-borderColor">
            <button
              type="submit"
              className="bg-global-green hover:bg-emerald-600 text-white font-extrabold text-base px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 w-full flex items-center justify-center gap-2"
            >
              <span>Join Discussion Now</span>
              <FiSend size={16} />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
