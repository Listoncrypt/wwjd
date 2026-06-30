# WWJD - What Would Jesus Do?

A spiritual guidance web app where Christians and seekers can ask questions and receive biblically-grounded answers inspired by Christ's teachings.

## Features

- Ask any question about life, faith, relationships, or moral dilemmas
- Receive thoughtful answers based on Jesus's teachings and the Bible
- Get relevant Bible verse references with each answer
- Beautiful, calming design with warm spiritual aesthetics
- Example questions to help users get started

## Tech Stack

**Frontend (webapp/)**
- React + TypeScript
- Tailwind CSS with shadcn/ui components
- Cormorant Garamond (elegant serif) & Inter (clean sans-serif) fonts

**Backend (backend/)**
- Hono API server on Bun
- OpenAI GPT-5.2 for AI-powered biblical guidance
- Zod validation for type-safe API contracts

## API Endpoints

### POST /api/ask
Ask a question and receive biblical guidance.

**Request:**
```json
{
  "question": "How should I handle conflict with a friend?"
}
```

**Response:**
```json
{
  "data": {
    "answer": "Jesus teaches us to seek reconciliation...",
    "verses": ["Matthew 18:15", "Ephesians 4:32"]
  }
}
```
