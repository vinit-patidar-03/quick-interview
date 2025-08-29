export const cleanJsonResponse = (response: string): string => {
  return response
    .replace(/^\s*```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .replace(/^\s*```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
};