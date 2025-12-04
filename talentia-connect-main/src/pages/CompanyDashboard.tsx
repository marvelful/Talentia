import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, Plus, BarChart2 } from "lucide-react";
import { api } from "@/lib/api";

export default function CompanyDashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [activeApplication, setActiveApplication] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "Gig",
    category: "Design",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });

  const { data: myGigs = [], isLoading: isLoadingMyGigs } = useQuery({
    queryKey: ["my-gigs"],
    queryFn: async () => {
      const token = localStorage.getItem("talentia_token");
      if (!token) {
        throw new Error("You must be logged in as a company to view your opportunities.");
      }
      return api.marketplace.listMyGigs(token);
    },
  });

  const { data: applications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ["gig-applications", selectedGig?.id],
    queryFn: async () => {
      if (!selectedGig) return [];
      const token = localStorage.getItem("talentia_token");
      if (!token) {
        throw new Error("You must be logged in as a company to view applications.");
      }
      return api.marketplace.listApplications(selectedGig.id, token);
    },
    enabled: !!selectedGig,
  });

  const { data: activeConversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ["application-conversation", activeApplication?.id],
    queryFn: async () => {
      if (!activeApplication) return null;
      const token = localStorage.getItem("talentia_token");
      if (!token) {
        throw new Error("You must be logged in as a company to view messages.");
      }
      return api.marketplace.getConversationForApplication(activeApplication.id, token);
    },
    enabled: !!activeApplication,
  });

  const approveApplication = useMutation({
    mutationFn: async (applicationId: string) => {
      const token = localStorage.getItem("talentia_token");
      if (!token) {
        throw new Error("You must be logged in as a company to approve applications.");
      }
      return api.marketplace.approveApplication(applicationId, token);
    },
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["gig-applications", selectedGig?.id] });
      const justApproved = applications.find((a: any) => a.id === applicationId) || null;
      setActiveApplication(justApproved);
    },
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!activeApplication) {
        throw new Error("No application selected.");
      }
      const token = localStorage.getItem("talentia_token");
      if (!token) {
        throw new Error("You must be logged in as a company to send messages.");
      }
      return api.marketplace.sendMessageForApplication(activeApplication.id, { content: newMessage }, token);
    },
    onSuccess: () => {
      setNewMessage("");
      if (activeApplication) {
        queryClient.invalidateQueries({ queryKey: ["application-conversation", activeApplication.id] });
      }
    },
  });

  const createGig = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("talentia_token");
      if (!token) throw new Error("You must be logged in as a company to post.");

      return api.marketplace.createGig(
        {
          title: form.title,
          description: form.description || undefined,
          location: form.location || undefined,
          type: form.type || undefined,
          category: form.category || undefined,
          budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
          budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        },
        token,
      );
    },
    onSuccess: () => {
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        location: "",
        type: "Gig",
        category: "Design",
        budgetMin: "",
        budgetMax: "",
        deadline: "",
      });
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Company Dashboard
              </h1>
              <p className="text-muted-foreground">
                Post opportunities and manage applications from university talent.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/messages")}>
                Messages
              </Button>
              <Button variant="coral" size="lg" onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Post New Opportunity
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
                <h2 className="text-lg font-semibold text-foreground mb-1">Post a New Opportunity</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Share a brief, focused brief so students quickly understand the role.
                </p>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createGig.mutate();
                  }}
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Title</label>
                    <input
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Location</label>
                      <input
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Type</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="Gig">Gig</option>
                        <option value="Contract">Contract</option>
                        <option value="Project">Project</option>
                        <option value="Ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Budget Min (XAF)</label>
                      <input
                        type="number"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.budgetMin}
                        onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                        min={0}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Budget Max (XAF)</label>
                      <input
                        type="number"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.budgetMax}
                        onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <input
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Deadline</label>
                      <input
                        type="date"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={createGig.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="coral" disabled={createGig.isPending}>
                      {createGig.isPending ? "Posting..." : "Post Opportunity"}
                    </Button>
                  </div>

                  {createGig.isError && (
                    <p className="text-sm text-destructive mt-2">
                      {(createGig.error as Error).message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {["Open Gigs", "Active Contracts", "Total Spend"].map((label, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-xl font-semibold text-foreground">-</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-coral" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-coral" />
                Recent Opportunities
              </h2>
            </div>

            {isLoadingMyGigs ? (
              <p className="text-sm text-muted-foreground">Loading your opportunities...</p>
            ) : myGigs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven't posted any opportunities yet. Click "Post New Opportunity" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {myGigs.map((gig: any) => (
                  <div
                    key={gig.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border hover:border-coral/40 hover:bg-muted/40 transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{gig.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {gig.location || "Remote"}  b7 {gig.type || "Gig"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applicants: <span className="font-medium">{gig.applicants ?? 0}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGig(gig);
                        setActiveApplication(null);
                        setNewMessage("");
                      }}
                      disabled={gig.applicants === 0}
                    >
                      {gig.applicants && gig.applicants > 0 ? "View applications" : "No applications"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedGig && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
              <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Applications for {selectedGig.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Review student proposals and shortlist promising talent.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGig(null);
                      setActiveApplication(null);
                      setNewMessage("");
                    }}
                  >
                    Close
                  </Button>
                </div>

                {isLoadingApplications ? (
                  <p className="text-sm text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications yet for this opportunity.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="border border-border rounded-xl p-4 bg-muted/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {app.studentName}
                            </p>
                            <p className="text-[11px] uppercase text-muted-foreground">
                              {app.status}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {app.proposal && (
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {app.proposal}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={app.status === "APPROVED" || approveApplication.isPending}
                              onClick={() => approveApplication.mutate(app.id)}
                            >
                              {app.status === "APPROVED"
                                ? "Approved"
                                : approveApplication.isPending
                                ? "Approving..."
                                : "Approve & Chat"}
                            </Button>
                            {app.status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant="coral"
                                onClick={() => setActiveApplication(app)}
                              >
                                Open Chat
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeApplication && (
                  <div className="mt-6 border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Chat with {activeApplication.studentName}
                    </h3>
                    {isLoadingConversation ? (
                      <p className="text-xs text-muted-foreground">Loading messages...</p>
                    ) : !activeConversation ? (
                      <p className="text-xs text-muted-foreground">
                        No messages yet. Start the conversation below.
                      </p>
                    ) : (
                      <div className="mb-3 max-h-56 overflow-y-auto space-y-2 border border-border rounded-md p-3 bg-muted/40">
                        {activeConversation.messages.length === 0 ? (
                          <p className="text-xs text-muted-foreground">
                            No messages yet. Be the first to say hello.
                          </p>
                        ) : (
                          activeConversation.messages.map((msg: any) => (
                            <div key={msg.id} className="text-xs">
                              <span className="font-semibold text-foreground">
                                {msg.senderId === activeConversation.companyId ? "You" : activeApplication.studentName}
                              </span>
                              <span className="text-muted-foreground">  b7 </span>
                              <span className="text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                              <p className="text-muted-foreground mt-0.5 whitespace-pre-line">
                                {msg.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newMessage.trim()) return;
                        sendMessage.mutate();
                      }}
                    >
                      <input
                        className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-foreground text-xs"
                        placeholder="Write a private message to the student..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="coral"
                        disabled={sendMessage.isPending}
                      >
                        {sendMessage.isPending ? "Sending..." : "Send"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
