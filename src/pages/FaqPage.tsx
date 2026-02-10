import { useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FAQ } from "../components/FAQ";
import { ScrollToTop } from "../components/ScrollToTop";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface BotMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export const FaqPage = () => {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am the IRED assistant. Ask me about listings, pricing, or how to work with our agents.",
    },
  ]);
  const [input, setInput] = useState("");

  const suggestions = useMemo(
    () => [
      "How do I list my property?",
      "Do you offer virtual tours?",
      "What areas do you cover?",
      "How long does a sale take?",
    ],
    [],
  );

  const getBotReply = (value: string) => {
    const text = value.toLowerCase();

    if (text.includes("list") || text.includes("sell")) {
      return "To list your property, share your details on the services page and we will arrange a valuation call within 24 hours.";
    }
    if (text.includes("virtual") || text.includes("tour")) {
      return "Yes. We provide 3D virtual tours and guided video walkthroughs for most premium listings.";
    }
    if (
      text.includes("area") ||
      text.includes("location") ||
      text.includes("cover")
    ) {
      return "We specialize across major Cameroonian cities and high-demand luxury corridors. Tell me your preferred area.";
    }
    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("fee")
    ) {
      return "Our pricing depends on the service. We will tailor a proposal once we learn your goals.";
    }
    if (
      text.includes("time") ||
      text.includes("long") ||
      text.includes("duration")
    ) {
      return "Timelines vary by market conditions, but our average listing closes 15% faster than the local market.";
    }

    return "Thanks for the question. Share a few more details and we will connect you with the right advisor.";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: trimmed },
      { id: prev.length + 2, sender: "bot", text: getBotReply(trimmed) },
    ]);
    setInput("");
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-white/65 backdrop-blur-sm" />
        <div className="container relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.2em] text-xs text-muted-foreground">
              FAQ
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold">
              Answers, Insights, and Support in One Place
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse common questions or chat with our IRED assistant for quick
              guidance.
            </p>
          </div>
        </div>
      </section>

      <FAQ />

      <section className="container pb-24 sm:pb-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Ask the IRED Bot</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get instant responses or share your situation and we will route it
              to the right specialist.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {suggestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  className="text-sm"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Live FAQ Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[320px] overflow-y-auto rounded-xl border border-primary/10 bg-muted/20 p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-white"
                          : "bg-white border border-primary/10"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your question..."
                  aria-label="Ask the IRED bot"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
};
