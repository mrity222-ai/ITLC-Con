import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://script.google.com/macros/s/AKfycbzrHC2uJIUJl8hdaDk3Wz3vYHN2bzEcIHaSugbJNePkMkBCTIHuXMP304IsMc-0cfo9/exec", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
