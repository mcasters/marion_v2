import { NextResponse } from "next/server";
import path from "node:path";
import * as fs from "node:fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!filename) {
    return new NextResponse(null, { status: 404 });
  }
  const filePathLibrary = path.join(
    `${process.env.PHOTOS_PATH!}`,
    "sculpture/md",
    filename,
  );

  try {
    if (fs.existsSync(filePathLibrary)) {
      const buffer = fs.readFileSync(filePathLibrary);
      return new NextResponse(buffer, {
        headers: {
          "content-type": "image/jpeg",
        },
      });
    }
    return new NextResponse(null, {
      status: 404,
    });
  } catch (error) {
    console.error("Error retrieving resource: ", error);
    return new NextResponse(null, {
      status: 500,
    });
  }
}
