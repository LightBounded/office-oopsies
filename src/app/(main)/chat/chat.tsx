"use client";

import { type User } from "lucia";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";

export function Chat({ user }: { user: User }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const onOpen = () => {
      socketRef.current?.send(
        `New user joined: ${user.firstName} ${user.lastName}`,
      );
    };

    const onMessage = (e: MessageEvent<string>) => {
      setMessages((prevMsgs) => [...prevMsgs, e.data]);
    };

    socketRef.current = new WebSocket("ws://localhost:3030/chat");
    socketRef.current.addEventListener("message", onMessage);
    socketRef.current.addEventListener("open", onOpen);

    return () => {
      socketRef.current?.removeEventListener("message", onMessage);
      socketRef.current?.removeEventListener("open", onOpen);
      socketRef.current?.close();
    };
  }, [user.firstName, user.lastName]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          socketRef.current?.send(message);
          setMessages((prevMsgs) => [...prevMsgs, message]);
          setMessage("");
        }}
      >
        <Input onChange={(e) => setMessage(e.target.value)} />
      </form>
      {messages.map((msg) => (
        <div key={msg}>{msg}</div>
      ))}
    </div>
  );
}
