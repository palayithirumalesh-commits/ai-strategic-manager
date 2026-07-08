import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, DUMMY_CHAT_SUGGESTIONS } from "@/api/api";
import type { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const INITIAL: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm your AI Strategy Assistant. Ask me about revenue trends, risks, decisions, or scenario outcomes — I'll reason through the data and cite my sources.",
  timestamp: new Date().toISOString(),
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: (text: string) => sendChatMessage(messages, text),
    onSuccess: (reply) => setMessages((prev) => [...prev, reply]),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  function submitMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate(text);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-white">AI Strategy Assistant</h1>
          <p className="text-sm text-ink-400">Ask questions, upload documents, get cited recommendations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Conversation saved" })}>
            <DynamicIcon name="check" className="h-4 w-4" /> Save Conversation
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Chat exported", description: "Downloaded as PDF." })}>
            Export Chat
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                  m.role === "user"
                    ? "bg-gradient-to-br from-brand-600 to-violet-600 text-white"
                    : "border border-ink-100 bg-white/80 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-100"
                )}
              >
                <p>{m.content}</p>
                {m.confidence && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-2 text-xs text-ink-400 dark:border-white/10">
                    <Badge variant="violet">Confidence {m.confidence}%</Badge>
                    {m.references?.map((r) => (
                      <span key={r} className="rounded-full bg-ink-100 px-2 py-0.5 dark:bg-white/10">{r}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-ink-100 bg-white/80 px-4 py-3 text-sm text-ink-400 dark:border-white/10 dark:bg-white/5">
                Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-ink-100 p-4 dark:border-white/10">
          <div className="mb-3 flex flex-wrap gap-2">
            {DUMMY_CHAT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submitMessage(s)}
                className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-500 transition-colors hover:bg-ink-100 dark:border-white/10 dark:hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submitMessage(input);
            }}
          >
            <Button
              type="button"
              variant={listening ? "destructive" : "outline"}
              size="icon"
              onClick={() => {
                setListening((v) => !v);
                toast({ title: listening ? "Voice input stopped" : "Listening…" });
              }}
            >
              <DynamicIcon name="bot" className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => toast({ title: "Document uploaded", description: "quarterly-report.pdf" })}>
              <DynamicIcon name="plus" className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Strategy Assistant…"
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || chatMutation.isPending}>
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
