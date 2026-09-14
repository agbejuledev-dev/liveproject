export type IndeedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt?: string;
  salary?: string;
  jobType?: string;
  remote?: boolean;
};

type IndeedSearchResponse = {
  jobs?: Array<{
    id?: string;
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    url?: string;
    date?: string;
    salary?: string;
    jobType?: string;
    remote?: boolean;
  }>;
  results?: Array<{
    id?: string;
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    url?: string;
    date?: string;
    salary?: string;
    jobType?: string;
    remote?: boolean;
  }>;
  total?: number;
};

const INDEED_API_URL =
  process.env.INDEED_API_URL || "https://api.indeed.com/v2/jobs";

const INDEED_API_KEY = process.env.INDEED_API_KEY;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeJob(job: NonNullable<IndeedSearchResponse["jobs"]>[number]): IndeedJob | null {
  const id = clean(job.id);
  const title = clean(job.title);

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    company: clean(job.company) || "Company not provided",
    location: clean(job.location) || "Location not provided",
    description: clean(job.description),
    url: clean(job.url),
    postedAt: clean(job.date) || undefined,
    salary: clean(job.salary) || undefined,
    jobType: clean(job.jobType) || undefined,
    remote: Boolean(job.remote),
  };
}

export async function searchIndeedJobs(params: {
  query?: string;
  country?: string;
  location?: string;
  remote?: boolean;
  page?: number;
  limit?: number;
}) {
  if (!INDEED_API_KEY) {
    throw new Error("INDEED_API_KEY is not configured.");
  }

  const {
    query = "",
    country = "",
    location = "",
    remote = false,
    page = 1,
    limit = 20,
  } = params;

  const searchParams = new URLSearchParams();

  if (query) searchParams.set("q", query);
  if (country) searchParams.set("country", country);
  if (location) searchParams.set("location", location);

  searchParams.set("page", String(Math.max(1, page)));
  searchParams.set("limit", String(Math.min(Math.max(1, limit), 50)));

  if (remote) {
    searchParams.set("remote", "true");
  }

  const response = await fetch(
    `${INDEED_API_URL}?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${INDEED_API_KEY}`,
        "X-API-Key": INDEED_API_KEY,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Indeed API request failed (${response.status}): ${
        errorText || response.statusText
      }`
    );
  }

  const data = (await response.json()) as IndeedSearchResponse;

  const rawJobs = data.jobs ?? data.results ?? [];

  const jobs = rawJobs
    .map(normalizeJob)
    .filter((job): job is IndeedJob => Boolean(job));

  return {
    jobs,
    total: data.total ?? jobs.length,
    page,
    limit,
  };
}