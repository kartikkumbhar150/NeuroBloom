import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        child_name,
        gender,
        age,
        report_url,
        session_timestamp AS created_at
      FROM public.child_assessment_features
      ORDER BY session_timestamp DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Postgres error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}
