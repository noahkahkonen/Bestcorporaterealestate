import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authOptions } from "@/lib/auth";

// 50MB max for brochures and financial docs (client upload bypasses 4.5MB server limit)
const MAX_BROCHURE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: "Blob storage not configured",
        detail: "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel → Storage.",
      },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: MAX_BROCHURE_SIZE,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("Blob handler error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: "Upload failed", detail: message }, { status: 400 });
  }
}
