import cache from "../db/cache";

type JobStatus = "processing" | "completed" | "failed";
interface Job {
  url: string;
  status: JobStatus;
  error?: string;
  result?: any;
}

export const JobStore = {
  setPending(id: string, url: string) {
    cache.set<Job>(id, {
      status: "processing",
      url,
    });
  },
  setCompleted(id: string, url: string, result?: any) {
    cache.set<Job>(id, {
      status: "completed",
      url,
      result
    });
  },
  setFailed(id: string, url: string, error: string) {
    cache.set<Job>(id, {
      status: "failed",
      url,
      error,
    });
  },
  get(id: string): Job | undefined {
    return cache.get<Job>(id);
  },
  delete(id: string) {
    cache.del(id);
  },
  has(id: string): boolean {
    return cache.has(id);
  }
}