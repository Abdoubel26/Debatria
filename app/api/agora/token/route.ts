import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-token"; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelName = searchParams.get("channelName");
  const roleType = searchParams.get("role");

  if (!channelName) {
    return NextResponse.json({ error: "Missing channel name" }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
  
  if (!appId || !appCertificate) {
    return NextResponse.json({ error: "Agora credentials missing on server" }, { status: 500 });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const role = roleType === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    0, 
    role,
    privilegeExpiredTs,
    privilegeExpiredTs
  );

  return NextResponse.json({ token, appId }, {status: 200});
}