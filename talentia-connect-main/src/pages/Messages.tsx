import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { MessageCircle, Send } from "lucide-react";

export default function Messages() {
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [contractAmount, setContractAmount] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("talentia_token") : null;
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isCompany = currentUser?.role === "COMPANY";

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["my-conversations"],
    queryFn: async () => {
      if (!token) {
        throw new Error("You must be logged in to view messages.");
      }
      return api.marketplace.listMyConversations(token);
    },
  });

  const activeConversation =
    conversations.find((c: any) => c.id === selectedConversationId) || conversations[0] || null;

  const { data: activeContract } = useQuery({
    queryKey: ["application-contract", activeConversation?.applicationId],
    queryFn: async () => {
      if (!token || !activeConversation) return null;
      return api.marketplace.getContractForApplication(activeConversation.applicationId, token);
    },
    enabled: !!token && !!activeConversation,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("You must be logged in to send messages.");
      }
      if (!activeConversation) {
        throw new Error("No conversation selected.");
      }
      return api.marketplace.sendMessageForApplication(
        activeConversation.applicationId,
        { content: newMessage },
        token,
      );
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["my-conversations"] });
    },
  });

  const createContract = useMutation({
    mutationFn: async () => {
      if (!token || !activeConversation) {
        throw new Error("Missing auth or conversation.");
      }
      const amountNumber = Number(contractAmount);
      if (!amountNumber || amountNumber <= 0) {
        throw new Error("Please enter a valid amount.");
      }
      return api.marketplace.createContractForApplication(
        activeConversation.applicationId,
        { agreedAmount: amountNumber },
        token,
      );
    },
    onSuccess: () => {
      setContractAmount("");
      queryClient.invalidateQueries({ queryKey: ["application-contract", activeConversation?.applicationId] });
    },
  });

  const releaseContract = useMutation({
    mutationFn: async () => {
      if (!token || !activeContract) {
        throw new Error("No contract to release.");
      }
      const ratingNumber = reviewRating ? Number(reviewRating) : undefined;
      return api.marketplace.releaseContract(
        activeContract.id,
        {
          rating: ratingNumber,
          comment: reviewComment || undefined,
        },
        token,
      );
    },
    onSuccess: () => {
      setReviewRating("");
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["application-contract", activeConversation?.applicationId] });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 h-[70vh]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-coral" />
                Messages
              </h1>
              <p className="text-muted-foreground text-sm">
                Private conversations between companies and students.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Conversations list */}
            <div className="bg-card border border-border rounded-2xl p-3 flex flex-col overflow-hidden">
              <h2 className="text-sm font-semibold text-foreground mb-3">Conversations</h2>
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading conversations...</p>
              ) : conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  You have no conversations yet. Apply for opportunities or approve applications to start.
                </p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-1">
                  {conversations.map((conv: any) => {
                    const isActive = activeConversation && conv.id === activeConversation.id;
                    const lastMessage =
                      conv.messages && conv.messages.length > 0
                        ? conv.messages[conv.messages.length - 1]
                        : null;

                    const otherLabel =
                      currentUser && conv.companyId === currentUser.id
                        ? "Student"
                        : "Company";

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-colors ${
                          isActive
                            ? "border-coral bg-coral/5 text-foreground"
                            : "border-border hover:border-coral/40 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-[11px] uppercase tracking-wide">
                            {otherLabel} chat
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {conv.messages.length} msg
                          </span>
                        </div>
                        {lastMessage && (
                          <p className="truncate text-[11px] text-muted-foreground">
                            {lastMessage.content}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Messages panel */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
              {!activeConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Select a conversation from the left to start chatting.
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Conversation</p>
                      <p className="text-xs text-muted-foreground">
                        Linked to an opportunity application.
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
                    {activeConversation.messages.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No messages yet. Say hello to start the conversation.
                      </p>
                    ) : (
                      activeConversation.messages.map((msg: any) => {
                        const isMine = currentUser && msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                                isMine
                                  ? "bg-coral text-accent-foreground rounded-br-sm"
                                  : "bg-background text-foreground border border-border rounded-bl-sm"
                              }`}
                            >
                              <p className="whitespace-pre-line break-words">{msg.content}</p>
                              <p className="mt-1 text-[9px] opacity-70">
                                {new Date(msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {activeContract && !isCompany && (
                    <div className="border-t border-border px-4 py-2 bg-muted/60 text-[11px] text-muted-foreground">
                      {activeContract.status === "COMPLETED" ? (
                        <span>
                          The transaction for this contract has been
                          {" "}
                          <span className="font-semibold text-teal">validated &amp; payment released</span>.
                          {" "}
                          You should now see these funds in your Talentia payout balance.
                        </span>
                      ) : (
                        <span>
                          A contract of <span className="font-semibold">XAF {activeContract.agreedAmount?.toLocaleString?.() ?? activeContract.agreedAmount}</span>
                          {" "}is currently held in escrow by Talentia until the company marks the work as completed.
                        </span>
                      )}
                    </div>
                  )}

                  {isCompany && (
                    <div className="border-t border-border px-4 py-3 bg-card/60">
                      {!activeContract ? (
                        <form
                          className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            createContract.mutate();
                          }}
                        >
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-foreground">Launch payment (escrow)</p>
                            <p className="text-[11px] text-muted-foreground mb-1">
                              Agree on an amount with the student, then lock funds in Talentia until work is done.
                            </p>
                            <input
                              className="w-full h-8 px-2 rounded-md border border-input bg-background text-foreground text-xs"
                              placeholder="Agreed amount in XAF"
                              value={contractAmount}
                              onChange={(e) => setContractAmount(e.target.value)}
                            />
                          </div>
                          <Button
                            type="submit"
                            size="sm"
                            variant="coral"
                            disabled={createContract.isPending}
                          >
                            {createContract.isPending ? "Creating..." : "Create Contract"}
                          </Button>
                        </form>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <p className="font-semibold text-foreground">
                              Contract amount: XAF {activeContract.agreedAmount?.toLocaleString?.() ?? activeContract.agreedAmount}
                            </p>
                            <p className="text-[11px] uppercase text-muted-foreground">
                              Status: {activeContract.status}
                            </p>
                          </div>
                          <form
                            className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3"
                            onSubmit={(e) => {
                              e.preventDefault();
                              releaseContract.mutate();
                            }}
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-foreground">Rating (1–5)</label>
                                <input
                                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-foreground text-xs"
                                  placeholder="5"
                                  value={reviewRating}
                                  onChange={(e) => setReviewRating(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-foreground">Short feedback</label>
                                <input
                                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-foreground text-xs"
                                  placeholder="Great work, on time and professional."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                />
                              </div>
                            </div>
                            <Button
                              type="submit"
                              size="sm"
                              variant="coral"
                              disabled={releaseContract.isPending}
                            >
                              {releaseContract.isPending ? "Releasing..." : "Release Payment & Review"}
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  <form
                    className="border-t border-border px-4 py-3 flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newMessage.trim()) return;
                      sendMessage.mutate();
                    }}
                  >
                    <input
                      className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-foreground text-xs"
                      placeholder="Write a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="coral"
                      disabled={sendMessage.isPending}
                    >
                      {sendMessage.isPending ? "Sending..." : <Send className="w-4 h-4" />}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
