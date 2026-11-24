import postgres from "postgres";

// postgres() connects lazily, on the first query, so the build never touches the database.
// `.server` in the file name keeps it out of the browser bundle.
export const sql = postgres(process.env.DATABASE_URL ?? "", { max: 5 });
