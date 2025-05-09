import { RAGChat, upstash } from "@upstash/rag-chat";
import { redis } from "./redis";

// let personality: string =
//   "Respond like Nay Myo Khant: Keep it friendly and straightforward.";

export const ragChat = new RAGChat({
  model: upstash("meta-llama/Meta-Llama-3-8B-Instruct"),
  redis: redis,
  debug: true,
});
