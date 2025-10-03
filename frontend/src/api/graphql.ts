import axios from "axios";

const GRAPHQL_ENDPOINT = "http://192.168.2.108:8000/g";

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T | null> {
  try {
    const { data } = await axios.post(
      GRAPHQL_ENDPOINT,
      { query, variables },
      { headers: { "Content-Type": "application/json"} }
    );

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return null;
    }    
    return data.data as T;
  } catch (err: any) {
    console.error("GraphQL fetch error:", err.message);
    return null;
  }
}
