import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || !user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file received.", { status: 400 });
    }

    // On Vercel, the file system is read-only, so we upload the image to Catbox.moe (free image hosting)
    const catboxFormData = new FormData();
    catboxFormData.append('reqtype', 'fileupload');
    catboxFormData.append('fileToUpload', file);

    const uploadRes = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxFormData,
    });

    if (!uploadRes.ok) {
      throw new Error(`Catbox upload failed: ${uploadRes.statusText}`);
    }

    const url = await uploadRes.text(); // Catbox returns the URL directly in plain text

    return NextResponse.json({ url: url.trim() });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
