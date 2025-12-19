"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <ChatInterface />
    </main>
  );
}
