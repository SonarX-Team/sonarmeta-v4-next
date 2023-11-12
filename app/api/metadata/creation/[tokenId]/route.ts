import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Creation from "@/models/creation.model";
import { creationMetadataType } from "@/types/creation.type";

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  try {
    await connectToDB();

    const res = await Creation.findOne({ tokenId: params.tokenId });

    if (!res)
      return NextResponse.json(
        { error: `The given creation with tokenID #${params.tokenId} is not found` },
        { status: 404 }
      );

    const metadata: creationMetadataType = {
      name: res.title,
      description: res.description,
      image: res.avatar,
      external_link: res.externalLink,
    };

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json({ error: `Internal Server Error with ${error.message}` }, { status: 500 });
  }
}
