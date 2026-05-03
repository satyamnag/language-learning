import { NextResponse } from 'next/server';

// Replace this with your actual IndicTrans2 model call (WASM, ONNX, or HTTP)
export async function POST(req: Request) {
  const { word, source, target } = await req.json();
  
  // Mock translation – demo only. Replace with real model.
  const mock: Record<string, string> = {
    'வணக்கம்': 'Hello',
    'எப்படி': 'How',
    'இருக்கது': 'is',
    'பள்ளி': 'school',
    'ஹாய்': 'Hi',
    'ரியா': 'Riya',
    'நாம்': 'We',
    'புதிய': 'new',
    'கணித': 'mathematics',
    'முறைகளை': 'methods',
    'கற்றோம்': 'learned'
  };
  const translation = mock[word] || word;
  return NextResponse.json({ translation });
}