# Supabase Edge Functions

This folder contains Edge Functions that need to be deployed to your Supabase project.

## Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref rrxddepuvhovcpkokuck
   ```

4. Set the OpenAI API key as a secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Deploy the functions:
   ```bash
   supabase functions deploy ask
   supabase functions deploy verses
   ```

## Functions

### `ask`
- **Method**: POST
- **Body**: `{ question: string, language: 'en' | 'fr' | 'es' | 'ig' | 'yo' }`
- **Returns**: `{ data: { answer: string, verses: string[] } }`

### `verses`
- **Method**: GET
- **Query**: `?ref=John+3:16`
- **Returns**: `{ data: { reference: string, text: string, verses: [...] } }`

## Environment Variables

The `ask` function requires:
- `OPENAI_API_KEY` - Your OpenAI API key for AI responses
