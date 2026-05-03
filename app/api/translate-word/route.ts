import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { word, source, target } = await req.json();
  
  // Complete mock dictionary for the Tamil conversation
  const mock: Record<string, string> = {
    // Greetings & basic words
    'ஹாய்': 'Hi',
    'ரியா': 'Riya',
    'பள்ளி': 'school',
    'எப்படி': 'how',
    'இருந்தது': 'was',
    'இன்று': 'today',
    'மிகவும்': 'very',
    'வேடிக்கையாக': 'fun',
    'நீ': 'you',
    'என்ன': 'what',
    'கற்றாய்': 'learned',
    'நாம்': 'we',
    'புதிய': 'new',
    'கணித': 'math',
    'முறைகள்': 'methods',
    'கற்றோம்': 'learned',
    'கணிதம்': 'mathematics',
    'கொஞ்சம்': 'a little',
    'கடினமாக': 'hard',
    'தெரிகிறது': 'seems',
    'இல்லை': 'no',
    'ஆசிரியர்': 'teacher',
    'அதை': 'it',
    'எளிதாக': 'easily',
    'செய்தார்': 'made/did',
    'அது': 'that',
    'நன்றாக': 'well',
    'இருக்கிறது': 'is',
    'ஆம்': 'yes',
    'நான்': 'I',
    'வகுப்பை': 'class',
    'ரசித்தேன்': 'enjoyed',
    'உனக்கு': 'to you',
    'அறிவியல்': 'science',
    'வகுப்பு': 'class',
    'இருந்ததா': 'was there?',
    'ஒரு': 'a/one',
    'சோதனை': 'experiment',
    'செய்தோம்': 'we did',
    'வாவ்': 'wow',
    'நிறங்களையும்': 'colors also',
    'தண்ணீரையும்': 'water also',
    'கலந்தோம்': 'we mixed',
    'அருமையாக': 'awesome',
    'ஆங்கில': 'English',
    'சிறிய': 'small',
    'கதையை': 'story',
    'படித்தோம்': 'we read',
    'அந்த': 'that',
    'கதை': 'story',
    'பிடித்ததா': 'liked?',
    'சுவாரஸ்யமாக': 'interesting',
    'போல': 'seems like',
    'விரும்பினேன்': 'liked',
    'தமிழ்': 'Tamil'
  };

  const translation = mock[word] || word; // fallback to the word itself if missing
  return NextResponse.json({ translation });
}