import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        // Verify the user is authenticated and is an ADMIN
        if (!session || !user || user.role !== "ADMIN") {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Here you could log or save to DB if needed
        console.log('Upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // Vercel Blob webhook will retry on non-200 responses
    );
  }
}
