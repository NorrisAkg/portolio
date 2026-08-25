export interface ApiErrorResponse {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?: unknown;
}

/**
 * Nettoie les préfixes générés par ofetch/Nuxt comme `[POST] "/api/...": 401 `
 */
function cleanFetchPrefix(msg: string): string {
  return msg.replace(/^\[[A-Z]+\]\s+"[^"]+"\s*:\s*(?:\d+\s+)?/i, '').trim();
}

export function formatApiError(
  err: unknown,
  defaultMessage = "Une erreur est survenue lors de l'opération."
): string {
  if (!err) return defaultMessage;
  if (typeof err === 'string') return cleanFetchPrefix(err);

  const errorObj = err as {
    data?: ApiErrorResponse;
    statusMessage?: string;
    message?: string;
  };

  const responseData = errorObj.data;

  // 1. Check if there are structured Zod issues in data.data
  if (responseData && Array.isArray(responseData.data) && responseData.data.length > 0) {
    const issues = responseData.data as Array<{ path?: string[]; message?: string }>;
    const formattedIssues = issues
      .map((issue) => {
        const path = issue.path && issue.path.length > 0 ? issue.path.join('.') : '';
        return path ? `${path} (${issue.message})` : issue.message;
      })
      .filter(Boolean);

    if (formattedIssues.length > 0) {
      return `Erreurs de validation : ${formattedIssues.join(', ')}`;
    }
  }

  // 2. Check for explicit statusMessage or message from server payload
  const serverMsg =
    responseData?.message ||
    responseData?.statusMessage ||
    errorObj.statusMessage;

  if (serverMsg && serverMsg !== 'Bad Request' && serverMsg !== 'Internal Server Error') {
    return cleanFetchPrefix(serverMsg);
  }

  // 3. Fallback to cleaned errorObj.message if meaningful
  if (errorObj.message) {
    const cleaned = cleanFetchPrefix(errorObj.message);
    if (cleaned && !cleaned.toLowerCase().startsWith('fetcherror')) {
      return cleaned;
    }
  }

  // 4. Default fallback
  return (serverMsg && cleanFetchPrefix(serverMsg)) || defaultMessage;
}

