import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Creation from "@/models/creation.model";
import { creationMetadataType } from "@/types/creation.type";

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  try {
    await connectToDB();

    const res = await Creation.findOne({ tokenId: params.tokenId });

    const metadata: creationMetadataType = {
      name: res.title,
      description: res.description,
      image: res.avatar,
      external_link: res.externalLink,
    };

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
