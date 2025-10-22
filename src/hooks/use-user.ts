import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!token,
    staleTime: Infinity,
    refetchOnWindowFocus: false, // don't refetch when window refocuses
    refetchOnReconnect: false, // don't refetch when reconnecting
    refetchOnMount: false, // don't refetch on remount
  });

  return query;
}
