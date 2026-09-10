import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://creator-bridge-backend.onrender.com";

function Chat() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const creatorProfile = JSON.parse(
    localStorage.getItem("creatorProfile") || "{}"
  );

  const brandProfile = JSON.parse(
    localStorage.getItem("brandProfile") || "{}"
  );

  const chatContext = JSON.parse(
    localStorage.getItem("currentChat") || "{}"
  );

  const currentApplication = JSON.parse(
    localStorage.getItem("currentApplication") || "{}"
  );

  const role =
    savedUser?.role ||
    localStorage.getItem("role") ||
    "creator";

  // ==================================================
  // APPLICATION ID
  // ==================================================

  const applicationId =
    chatContext.applicationId ||
    currentApplication.mongoId ||
    currentApplication.id ||
    chatContext.application?._id ||
    chatContext.application?.id ||
    "";

  // ==================================================
  // DIRECT CHAT DATA
  // ==================================================

  const directCreatorId =
    chatContext.creatorId ||
    chatContext.creator?._id ||
    chatContext.creator?.id ||
    "";

  const directCampaignId =
    chatContext.campaignId ||
    chatContext.campaign?._id ||
    chatContext.campaign?.id ||
    "";

  const isDirectChat =
    Boolean(chatContext.directChat) &&
    Boolean(directCreatorId) &&
    Boolean(directCampaignId);

  // ==================================================
  // CREATOR / BRAND NAME
  // ==================================================

  const [creatorName, setCreatorName] = useState(
    creatorProfile.name ||
      chatContext.creatorName ||
      currentApplication.creatorName ||
      chatContext.creator ||
      "Creator"
  );

  const [brandName, setBrandName] = useState(
    brandProfile.companyName ||
      chatContext.brandName ||
      chatContext.brand ||
      currentApplication.brand ||
      "Brand"
  );

  const [campaignTitle, setCampaignTitle] =
    useState(
      chatContext.campaignTitle ||
        currentApplication.campaignTitle ||
        chatContext.campaign?.title ||
        "Campaign"
    );

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD / CREATE CONVERSATION
  // ==================================================

  useEffect(() => {
    const loadConversation = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      // ==================================================
      // VALID CHAT CONTEXT
      // ==================================================

      if (
        !applicationId &&
        !isDirectChat
      ) {
        setError(
          "Chat information is missing. Please open Chat from an application or start a conversation from a creator profile."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ==================================================
        // REQUEST BODY
        // ==================================================

        const requestBody = applicationId
          ? {
              applicationId,
            }
          : {
              creatorId:
                directCreatorId,
              campaignId:
                directCampaignId,
            };

        console.log(
          "Opening chat with:",
          requestBody
        );

        // ==================================================
        // CREATE / GET CONVERSATION
        // ==================================================

        const conversationResponse =
          await fetch(
            `${API_BASE_URL}/api/chat/conversations`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        const conversationData =
          await conversationResponse.json();

        if (!conversationResponse.ok) {
          throw new Error(
            conversationData.message ||
              "Failed to open conversation"
          );
        }

        const currentConversation =
          conversationData.conversation;

        if (!currentConversation) {
          throw new Error(
            "Conversation data was not returned by the server."
          );
        }

        setConversation(
          currentConversation
        );

        // ==================================================
        // UPDATE NAMES FROM BACKEND
        // ==================================================

        if (
          currentConversation.creatorId &&
          typeof currentConversation.creatorId ===
            "object"
        ) {
          setCreatorName(
            currentConversation.creatorId
              .name ||
              currentConversation.creatorId
                .username ||
              "Creator"
          );
        }

        if (
          currentConversation.brandId &&
          typeof currentConversation.brandId ===
            "object"
        ) {
          setBrandName(
            currentConversation.brandId
              .companyName ||
              "Brand"
          );
        }

        if (
          currentConversation.campaignId &&
          typeof currentConversation.campaignId ===
            "object"
        ) {
          setCampaignTitle(
            currentConversation.campaignId
              .title ||
              "Campaign"
          );
        }

        // ==================================================
        // SAVE CONVERSATION
        // ==================================================

        localStorage.setItem(
          "currentConversation",
          JSON.stringify(
            currentConversation
          )
        );

        // ==================================================
        // SAVE UPDATED CHAT CONTEXT
        // ==================================================

        const updatedChatContext = {
          ...chatContext,

          applicationId:
            currentConversation.applicationId ||
            applicationId ||
            null,

          creatorId:
            currentConversation.creatorId?._id ||
            directCreatorId ||
            null,

          brandId:
            currentConversation.brandId?._id ||
            null,

          campaignId:
            currentConversation.campaignId?._id ||
            directCampaignId ||
            null,

          campaignTitle:
            currentConversation.campaignId?.title ||
            campaignTitle,
        };

        localStorage.setItem(
          "currentChat",
          JSON.stringify(
            updatedChatContext
          )
        );

        // ==================================================
        // LOAD MESSAGES
        // ==================================================

        const messagesResponse =
          await fetch(
            `${API_BASE_URL}/api/chat/conversations/${currentConversation._id}/messages`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const messagesData =
          await messagesResponse.json();

        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.message ||
              "Failed to load messages"
          );
        }

        setMessages(
          messagesData.messages || []
        );
      } catch (error) {
        console.error(
          "Chat loading error:",
          error
        );

        setError(
          error.message ||
            "Failed to load conversation"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [
    token,
    applicationId,
    isDirectChat,
    directCreatorId,
    directCampaignId,
    navigate,
  ]);

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    if (!conversation?._id) {
      alert(
        "Conversation is not ready yet."
      );

      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `${API_BASE_URL}/api/chat/conversations/${conversation._id}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            text: newMessage.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send message"
        );
      }

      setMessages((prev) => [
        ...prev,
        data.data,
      ]);

      setNewMessage("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      alert(
        error.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // ==================================================
  // DASHBOARD PATH
  // ==================================================

  const dashboardPath =
    role === "brand"
      ? "/brand-dashboard"
      : "/creator-dashboard";

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-bold text-purple-600"
          >
            Creator Bridge
          </Link>

          <Link
            to={dashboardPath}
            className="text-gray-600 hover:text-purple-600 font-medium"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Chat Container */}

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          {/* Chat Header */}

          <div className="px-6 py-5 border-b flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                {role === "brand"
                  ? "👤"
                  : "🏢"}
              </div>

              <div>

                <h1 className="font-bold text-gray-900 text-lg">
                  {role === "brand"
                    ? creatorName
                    : brandName}
                </h1>

                <p className="text-sm text-green-600">
                  ● Private Conversation
                </p>

              </div>

            </div>

            <div className="hidden sm:block text-right">

              <p className="text-sm text-gray-500">
                Campaign
              </p>

              <p className="font-semibold text-gray-900">
                {campaignTitle}
              </p>

            </div>

          </div>

          {/* Campaign Context */}

          <div className="bg-purple-50 px-6 py-4 border-b">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-purple-600 font-semibold">
                  CAMPAIGN DISCUSSION
                </p>

                <p className="font-bold text-gray-900 mt-1">
                  {campaignTitle}
                </p>

              </div>

              <Link
                to="/campaign-details"
                className="text-sm text-purple-600 font-semibold hover:text-purple-700"
              >
                View Campaign →
              </Link>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Messages */}

          <div className="h-[500px] overflow-y-auto p-6 space-y-5 bg-gray-50">

            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Opening private conversation...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  No messages yet. Start the conversation.
                </p>
              </div>
            ) : (
              messages.map((message) => {

                const isCreator =
                  message.senderRole ===
                  "creator";

                const senderId =
                  typeof message.senderId ===
                  "object"
                    ? message.senderId?._id
                    : message.senderId;

                const isMine =
                  String(senderId) ===
                  String(savedUser?.id);

                const senderName =
                  isCreator
                    ? creatorName
                    : brandName;

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] ${
                        isMine
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
                    >

                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isMine
                            ? "bg-purple-600 text-white rounded-br-md"
                            : "bg-white text-gray-800 border rounded-bl-md"
                        }`}
                      >

                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>

                      </div>

                      <div className="flex gap-2 mt-1 px-1">

                        <span className="text-xs text-gray-500">
                          {senderName}
                        </span>

                        <span className="text-xs text-gray-400">
                          {message.createdAt
                            ? new Date(
                                message.createdAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* Message Input */}

          <form
            onSubmit={sendMessage}
            className="p-4 border-t bg-white"
          >

            <div className="flex gap-3">

              <input
                type="text"
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(
                    e.target.value
                  )
                }
                placeholder="Type your message..."
                disabled={
                  loading ||
                  !conversation
                }
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  loading ||
                  !conversation ||
                  !newMessage.trim()
                }
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>

          </form>

        </div>

        {/* Privacy Note */}

        <div className="mt-5 bg-white border rounded-xl p-4 text-center">

          <p className="text-sm text-gray-500">
            🔒 Your conversation is private and
            only visible to the brand and creator
            involved in this campaign.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Chat;