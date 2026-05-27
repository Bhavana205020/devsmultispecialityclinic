import { MessageCircle, Calendar, Bot, X, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { externalLinkProps } from "@/lib/external-link";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=919666205020&text&type=phone_number&app_absent=0";

type Msg = { role: "user" | "assistant"; content: string };

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Dev's Clinic Assistant. I can help you find the right department, share doctor info, clinic timings, services, or book an appointment. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto popup hint after 5s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!chatOpen) setShowHint(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [chatOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const scrollToBooking = () => {
    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
  };

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sorry, I couldn't reach the assistant. Please try again.";
      setMessages([...next, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const openChat = () => {
    setShowHint(false);
    setChatOpen(true);
  };

  return (
    <>
      {/* Floating action stack — right side */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Hint bubble */}
        {showHint && !chatOpen && (
          <button
            onClick={openChat}
            className="max-w-[260px] bg-background border border-border shadow-soft rounded-2xl rounded-br-sm px-4 py-3 text-left animate-fade-in"
          >
            <p className="text-xs font-bold text-brand flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Dev's Assistant
            </p>
            <p className="text-xs text-foreground/80 mt-1">
              Need help choosing a department or booking? Ask me anything!
            </p>
          </button>
        )}

        {/* AI Bot */}
        <button
          onClick={() => (chatOpen ? setChatOpen(false) : openChat())}
          aria-label="Chat with Dev's AI Assistant"
          className="relative h-14 w-14 rounded-full bg-brand hover:bg-brand/90 text-brand-foreground shadow-soft flex items-center justify-center transition-transform hover:scale-110"
        >
          {chatOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
          {!chatOpen && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-gold border-2 border-background animate-pulse" />
          )}
        </button>

        {/* Appointment */}
        <button
          onClick={scrollToBooking}
          aria-label="Book an appointment"
          className="h-14 w-14 rounded-full bg-gold hover:opacity-90 text-gold-foreground shadow-soft flex items-center justify-center transition-transform hover:scale-110"
        >
          <Calendar className="h-6 w-6" />
        </button>

        {/* WhatsApp */}
        <a
          {...externalLinkProps(WHATSAPP_URL)}
          aria-label="Chat on WhatsApp"
          className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-soft flex items-center justify-center transition-transform hover:scale-110"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </div>

      {/* Chat window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(92vw,380px)] h-[min(80vh,560px)] bg-background border border-border rounded-3xl shadow-soft flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-brand text-brand-foreground px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight">Dev's Clinic Assistant</p>
              <p className="text-[11px] opacity-80 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · AI-powered
              </p>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-soft/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand text-brand-foreground rounded-br-sm"
                      : "bg-background border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand/60 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand/60 animate-bounce [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand/60 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="border-t border-border p-2 flex items-center gap-2 bg-background">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, doctors, timings..."
              className="flex-1 bg-soft rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 w-10 rounded-full bg-gold text-gold-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Sticky Book Appointment (mobile primary) */}
      <button
        onClick={scrollToBooking}
        className="fixed bottom-6 left-6 z-40 md:hidden btn-gold rounded-full px-4 py-3 text-sm font-semibold shadow-soft inline-flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" /> Book Appointment
      </button>
    </>
  );
}
