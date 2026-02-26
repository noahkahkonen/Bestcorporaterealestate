import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = path.extname(file.name) || ".bin";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    // Vercel: use Blob storage (read-only filesystem)
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const blob = await put(`${folder}/${name}`, file, {
        access: "public",
        token,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Vercel without token: cannot write to filesystem
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error: "Upload failed",
          detail:
            "BLOB_READ_WRITE_TOKEN is not set. Add it in Vercel → Settings → Environment Variables (from your Blob store).",
        },
        { status: 500 }
      );
    }

    // Local dev: write to filesystem
    await mkdir(path.join(UPLOAD_DIR, folder), { recursive: true });
    const filePath = path.join(UPLOAD_DIR, folder, name);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${folder}/${name}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: "Upload failed", detail: message }, { status: 500 });
  }
}
