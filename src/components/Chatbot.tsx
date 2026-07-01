 
// import React, { useState, useRef, useEffect } from "react";
 
// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }
 
// export default function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([
//     { role: "assistant", content: "Hi 👋 I'm your AI assistant. How can I help you?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
 
//   const bottomRef = useRef<HTMLDivElement | null>(null);
 
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
 
//   // 🔥 FIXED AI LOGIC
//   const callAI = async (text: string) => {
//     const msg = text.toLowerCase().trim();
 
//     // ======================
//     // ✅ STRICT GREETING (FIXED)
//     // ======================
//     const greetings = ["hi", "hello", "hey"];
//     if (greetings.includes(msg)) {
//       return "Hi 👋 How may I help you?";
//     }
 
//     // ======================
//     // 📊 SALES (ALL 5 QUESTIONS)
//     // ======================
//     if (msg.includes("pending") && msg.includes("sales"))
//       return "There are 12 pending sales bills.";
 
//     if (msg.includes("total") && msg.includes("sales"))
//       return "Total sales amount this month is ₹1,80,000.";
 
//     if (msg.includes("rejected") && msg.includes("sales"))
//       return "There are 3 rejected sales bills.";
 
//     if (msg.includes("approved") && msg.includes("sales") && msg.includes("today"))
//       return "5 sales bills were approved today.";
 
//     if (msg.includes("average") && msg.includes("sales"))
//       return "Average sales bill amount is ₹6,500.";
 
//     // ======================
//     // 🏢 VENDOR (ALL 5 QUESTIONS)
//     // ======================
//     if (msg.includes("pending") && msg.includes("vendor"))
//       return "There are 8 pending vendor bills.";
 
//     if (msg.includes("vendor") && msg.includes("today"))
//       return "4 vendor bills were uploaded today.";
 
//     if (msg.includes("total") && msg.includes("vendor"))
//       return "Total vendor bill amount is ₹2,40,000.";
 
//     if (msg.includes("rejected") && msg.includes("vendor"))
//       return "2 vendor bills were rejected.";
 
//     if (msg.includes("highest") && msg.includes("vendor"))
//       return "Vendor 'Akash Pvt Ltd' has the highest bill amount of ₹50,000.";
 
//     // ======================
//     // 💰 FINANCE (ALL 5 QUESTIONS)
//     // ======================
//     if (msg.includes("pending") && msg.includes("approval"))
//       return "There are 10 bills pending for approval.";
 
//     if (msg.includes("total") && msg.includes("approved"))
//       return "Total approved amount is ₹3,20,000.";
 
//     if (msg.includes("fraud"))
//       return "3 bills are flagged as high fraud risk.";
 
//     if (msg.includes("approval rate"))
//       return "Current approval rate is 82%.";
 
//     if (msg.includes("processed") || msg.includes("payments"))
//       return "A total of ₹2,75,000 has been processed in payments.";
 
//     // ======================
//     // ❌ DEFAULT
//     // ======================
//     return "Sorry, I didn't understand that. Please try asking something else 😊";
//   };
 
//   const handleSend = async () => {
//     if (!input.trim()) return;
 
//     const userMsg = { role: "user" as const, content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);
 
//     try {
//       const reply = await callAI(input);
//       setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   return (
//     <div className="flex flex-col h-full w-full bg-background">
 
//       <div className="px-6 py-4 border-b text-lg font-semibold">
//         AI Chatbot 🤖
//       </div>
 
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-2 rounded-lg text-sm max-w-[60%] ${
//                 msg.role === "user"
//                   ? "bg-primary text-white"
//                   : "bg-muted border"
//               }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}
 
//         {loading && (
//           <div className="text-sm text-muted-foreground">Typing...</div>
//         )}
 
//         <div ref={bottomRef} />
//       </div>
 
//       <div className="border-t p-4 bg-background">
//         <div className="flex gap-3 max-w-4xl mx-auto">
//           <input
//             className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none"
//             placeholder="Type your message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <button
//             onClick={handleSend}
//             className="bg-primary text-white px-5 rounded-lg"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
 

 
import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "@/config";
 
interface Message {
  role: "user" | "assistant";
  content: string;
}
 
export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
 
  const bottomRef = useRef<HTMLDivElement | null>(null);
 
  const BASE_URL = API_BASE_URL;
 
  // ✅ Get user_id from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData).user_id;
  };
 
  // =========================
  // 🔥 CREATE THREAD
  // =========================
  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch(`${BASE_URL}/create-thread`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
 
        const data = await res.json();
        setThreadId(data.thread_id);
        console.log("Thread created:", data.thread_id);
      } catch (err) {
        console.error("Thread creation failed", err);
      }
    };
 
    createThread();
  }, []);
 
  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  // =========================
  // 🧠 FORMAT RESPONSE (KEY-VALUE)
 
  const formatKeyValue = (text: string) => {
    if (!text) return [];
 
    return text
      .replace(/\*\*/g, "") // remove **
      .split("\n") // ONLY split by new line
      .map((line) => line.trim())
      .filter((line) => line.includes(":")) // valid key:value only
      .map((line) => {
        const parts = line.split(":");
 
        return {
          key: parts[0].trim(),
          value: parts.slice(1).join(":").trim()
        };
      });
  };
  // =========================
  // 🔥 CHAT API CALL
  // =========================
  const callChatAPI = async (query: string) => {
    try {
      const user_id = getUserId();
 
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          thread_id: threadId,
          query: query,
          user_id: user_id
        })
      });
 
      const data = await res.json();
 
      return data.response || data.answer || "No response from AI";
    } catch (error) {
      console.error("Chat API error:", error);
      return "Something went wrong ❌";
    }
  };
 
  // =========================
  // ✉️ HANDLE SEND
  // =========================
  const handleSend = async () => {
    if (!input.trim() || !threadId) return;
 
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
 
    setInput("");
    setLoading(true);
 
    try {
      const reply = await callChatAPI(input);
 
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex flex-col h-full w-full bg-background">
 
      {/* HEADER */}
      <div className="px-6 py-4 border-b text-lg font-semibold">
        AI Chatbot 🤖
      </div>
 
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-lg text-sm max-w-[60%] ${msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-muted border"
                }`}
            >
 
              {msg.role === "assistant" ? (
                formatKeyValue(msg.content).length > 0 ? (
                  <div className="space-y-1">
                    {formatKeyValue(msg.content).map((item, idx) => (
                      <div key={idx}>
                        <span className="font-semibold">{item.key}:</span>{" "}
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>{msg.content}</div> // 🔥 fallback for paragraph
                )
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
 
        {loading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
 
        <div ref={bottomRef} />
      </div>
 
      {/* INPUT */}
 
      <div className="border-t p-4 bg-background">
        <div className="flex gap-3 max-w-4xl mx-auto">
 
          {/* INPUT */}
          <input
            className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none
      border-[#0B1F3A]
      focus:ring-2 focus:ring-[#132B50]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
 
          {/* SEND BUTTON */}
          <button
            onClick={handleSend}
            className="bg-[#0B1F3A] hover:bg-[#132B50] text-white px-4 py-2 rounded-lg
      flex items-center justify-center transition-all duration-200"
          >
            {/* PAPER PLANE ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.4 20.6c-.4.2-.8-.2-.6-.6l2.2-6.6L17.7 6 5.4 13.4l-2 6.2zm3.3-7.7l8.7-5.3-6.6 6.9-.3 4.5c0 .3.3.5.5.3l2.7-2.6 5.4 3.9c.3.2.7 0 .8-.3l3.3-15c.1-.4-.3-.7-.7-.6L3.4 10.7c-.4.1-.4.7 0 .9l3.3 1.3z" />
            </svg>
          </button>
 
        </div>
      </div>
    </div>
  );
}
 