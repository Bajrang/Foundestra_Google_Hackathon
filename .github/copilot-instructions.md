# AI Coding Agent Instructions for LLM Itinerary Generator

## Project Overview
This is a React TypeScript SPA for AI-powered travel itinerary generation. It uses Google Gemini AI for dynamic destination search, Supabase Edge Functions for backend, and supports 9 Indian languages.

## Architecture
- **Frontend**: React 18 + Vite, Radix UI components, Tailwind CSS
- **Backend**: Supabase Edge Functions (`https://${projectId}.supabase.co/functions/v1/make-server-f7922768/${endpoint}`)
- **AI**: Gemini 2.0 Flash Lite via `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`
- **State**: Custom hooks (`useAppState`, `useApiCall`) with app states: 'planning' → 'generating' → 'viewing'
- **Multilingual**: Translations in `src/utils/translations.ts`, hook `useTranslation(language)`

## Key Patterns
- **API Calls**: Use `useApiCall()` hook for all backend requests (e.g., `apiCall('generate-itinerary', { body: tripData })`)
- **Components**: Pages in `src/components/pages/`, UI in `src/components/ui/` (shadcn/ui style)
- **Error Handling**: Wrap components in `SimpleErrorBoundary`, use `toast` from sonner
- **Icons**: Import from `lucide-react` (e.g., `<Sparkles className="w-6 h-6" />`)
- **Styling**: Tailwind classes, responsive design with mobile-first approach
- **AI Integration**: For place search, send user query to Gemini with context about Indian destinations

## Development Workflow
- **Start**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (outputs to `build/` directory)
- **Deploy**: Docker build with Nginx serving static files on port 8080
- **Environment**: Set Supabase secrets for `GOOGLE_SERVICE_ACCOUNT_KEY` (OAuth) and API keys

## Conventions
- **File Structure**: Components in `src/components/`, hooks in `src/hooks/`, utils in `src/utils/`
- **Imports**: Use `@/` alias for `src/` (configured in `vite.config.ts`)
- **Naming**: PascalCase for components, camelCase for hooks/functions
- **Props**: Interface definitions for component props (e.g., `PlanningPageProps`)
- **Async**: Use `useCallback` for event handlers that trigger API calls
- **Language Support**: Always pass `selectedLanguage` prop and use `useTranslation(selectedLanguage)`

## Examples
- **Adding new page**: Create in `src/components/pages/`, add state in `useAppState`, route in `App.tsx` switch
- **New API endpoint**: Add to Supabase function, call via `useApiCall('new-endpoint', { body: data })`
- **Translation**: Add key to all language objects in `translations.ts`, use `t.keyName` in components
- **UI Component**: Follow shadcn pattern: `export const Component = forwardRef<HTMLDivElement, Props>((props, ref) => ...)`

## Key Files
- `src/App.tsx`: Main app logic and routing
- `src/hooks/useApiCall.ts`: Backend communication
- `src/utils/translations.ts`: Multilingual support
- `src/components/pages/PlanningPage.tsx`: Trip planning interface
- `package.json`: Scripts and dependencies
- `vite.config.ts`: Build configuration</content>
<parameter name="filePath">/Users/bajrang/workspace/Foundestra_Google_Hackathon/.github/copilot-instructions.md