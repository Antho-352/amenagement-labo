const WP_GRAPHQL_URL = import.meta.env.WP_GRAPHQL_URL || 'https://wp.amenagement-labo.fr/graphql';

interface GraphQLResponse<T = unknown> {
  data: T;
  errors?: { message: string }[];
}

export async function wpQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Support preview mode with auth token
  const authToken = import.meta.env.WP_AUTH_TOKEN;
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data;
}
