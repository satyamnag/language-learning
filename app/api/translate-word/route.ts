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
    'கற்றோம்': 'learned',
    'காலை': 'morning',
    'செல்லமே': 'darling',
    'எழுந்திரு': 'wake up',
    'சூரியன்': 'sun',
    'ஏற்கனவே': 'already',
    'உயர்ந்து': 'risen',
    'விட்டான்': 'has',
    'ம்ம்ம்': 'Mmm',
    'இன்னும்': 'still',
    'ஐந்து': 'five',
    'நிமிடம்': 'minutes',
    'மட்டும்': 'only',
    'அம்மா': 'Mom',
    'இனி': 'no more',
    'சொல்லவேண்டாம்': 'do not say',
    'மணி': 'o\'clock',
    'ஆகிவிட்டது': 'has become'
  };
  const translation = mock[word] || word;
  return NextResponse.json({ translation });
}