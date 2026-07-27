import { API } from "../config";

export interface CommunityMessage {
  id: string;
  sender_name: string;
  sender_email?: string;
  user_id?: string;
  message: string;
  reply_to_id?: string;
  reply_to?: CommunityMessage;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  created_at: string;
}

export const getCommunityMessages = async () => {
  const response = await API.get("/community/messages");
  return response.data;
};

export const sendCommunityMessage = async (payload: {
  sender_name: string;
  sender_email?: string;
  message: string;
  reply_to_id?: string;
}) => {
  const response = await API.post("/community/send", payload);
  return response.data;
};

export const reactToCommunityMessage = async (
  messageId: string,
  payload: { emoji: string; sender_name: string }
) => {
  const response = await API.post(`/community/messages/${messageId}/react`, payload);
  return response.data;
};
