import { useEffect, useState } from "react";
import { api } from "../services/api";

type JobMatch = {
  id: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
};

function useJobMatches(currentPage: number) {
  const [matches, setMatches] = useState<JobMatch[]>([]);

  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);

    api
      .getJobMatches(currentPage)
      .then((data) => {
        setMatches(data.matches || []);

        setTotalPages(data.totalPages || 1);
      })
      .catch((error) => console.error(error))

      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  return {
    matches,
    loading,
    totalPages,
    setMatches,
  };
}

export default useJobMatches;
