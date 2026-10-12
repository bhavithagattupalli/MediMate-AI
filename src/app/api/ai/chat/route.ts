import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectEmergency } from '@/lib/triageEngine';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';

    // 1. Red-flag emergency screening
    const emergencyCheck = detectEmergency(latestUserMessage, '');
    if (emergencyCheck.isEmergency) {
      return NextResponse.json({
        reply: `🚨 **CRITICAL MEDICAL EMERGENCY ALERT**\n\nThe symptoms you mentioned (${emergencyCheck.reason}) are critical red flags that require **immediate emergency medical evaluation**.\n\n- **Call Emergency Services immediately**: **108** (India) / **112** (Universal) / **911** (US).\n- Go to the nearest Hospital Emergency Department.\n- Do not attempt to drive yourself.\n- Sit or rest comfortably with airways clear while waiting for emergency responders.\n\n*Routine appointments and online chats are not suitable for acute emergencies.*`,
        isEmergency: true,
      });
    }

    // 2. Live Gemini Model if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: `You are MediMate AI Health Copilot, an empathetic, evidence-informed healthcare education and care-navigation assistant.
Core Principles:
1. Provide helpful medical education and explain symptoms in simple, supportive language.
2. YOU ARE NOT A REPLACEMENT FOR A DOCTOR. Never claim to diagnose specific diseases with certainty.
3. Never prescribe medications or specify exact prescription pharmaceutical dosages.
4. Recommend the most appropriate medical specialty when relevant (e.g. Gynecologist, Pediatrician, Geriatrician, Cardiologist).
5. Suggest conservative, safe self-care (hydration, rest, balanced nutrition).
6. Language: If the user writes or selects a specific language (Telugu, Hindi, Tamil, or English), respond warmly in that language or English with respectful clarity.
7. Always conclude with a gentle reminder to seek professional clinical consultation.`,
        });

        // Convert message history for Gemini chat
        const history = messages.slice(0, -1).map((m: ChatMessage) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(latestUserMessage);
        const reply = result.response.text();

        return NextResponse.json({ reply, isEmergency: false });
      } catch (geminiError: any) {
        console.error('Gemini API execution error:', geminiError);
        // Fall through to fallback engine rather than breaking the chat
      }
    }

    // 3. Intelligent Clinical Knowledge Fallback Engine
    // Provides immediate, rich, safe health navigation without breaking when no API key is supplied
    const query = latestUserMessage.toLowerCase();
    let reply = '';

    if (query.includes('fever') || query.includes('temperature') || query.includes('hot')) {
      reply = `**Understanding Fever & Supportive Care**\n\nFever is your body's natural immunological response to fighting viral or bacterial infections.\n\n**Helpful Self-Care Steps:**\n- **Rest & Hydration:** Sip clean water, warm broths, or oral rehydration fluids to prevent dehydration.\n- **Room Comfort:** Wear lightweight cotton clothing and maintain a well-ventilated, comfortable room temperature.\n- **Cooling:** A lukewarm (not cold) cloth applied to the forehead can soothe discomfort.\n\n**When to See a Doctor:**\n- Fever exceeding 102°F (38.9°C) lasting more than 3 consecutive days\n- Stiff neck, severe headache, confusion, or difficulty breathing\n- In infants under 3 months, any fever requires prompt pediatric evaluation.\n\n*Recommended Specialty: General Physician or Pediatrician for children.*`;
    } else if (query.includes('headache') || query.includes('migraine') || query.includes('head')) {
      reply = `**Headache Guidance & Self-Care**\n\nCommon headaches can stem from muscle tension, dehydration, eye strain, stress, or migraines.\n\n**Safe Care Recommendations:**\n- Drink 2 large glasses of water immediately; mild dehydration is a frequent headache trigger.\n- Rest in a quiet, darkened room away from digital screens and bright glare.\n- Apply a gentle cold compress to the forehead or warm towel to the neck muscles.\n\n**Warning Signs Requiring Urgent Care:**\n- "Thunderclap" headache (sudden, explosive, severe pain unlike any previous headache)\n- Headache accompanied by fever, neck stiffness, numbness, or slurred speech.\n\n*Recommended Specialty: General Physician or Neurologist.*`;
    } else if (query.includes('diabetes') || query.includes('sugar') || query.includes('glucose')) {
      reply = `**Blood Sugar & Metabolic Wellness**\n\nManaging healthy glucose levels involves balanced nutrition, daily physical movement, and consistent monitoring.\n\n**Nutrition & Lifestyle Tips:**\n- Focus on complex carbohydrates with high dietary fiber (legumes, vegetables, oats, whole grains) rather than refined flour and sugar.\n- Engage in 20-30 minutes of brisk walking after main meals to improve muscle insulin sensitivity.\n- Stay well-hydrated with pure water, minimizing sugary juices and carbonated beverages.\n\n**Warning Signs:**\n- Symptoms of low blood sugar (hypoglycemia): shaking, cold sweating, disorientation, extreme dizziness.\n\n*Recommended Specialty: Endocrinologist & Diabetologist.*`;
    } else if (query.includes('period') || query.includes('pcos') || query.includes('cramp') || query.includes('menstru')) {
      reply = `**Menstrual Health & Hormonal Balance**\n\nMenstrual discomfort and irregular cycles are very common and can often be managed with targeted care.\n\n**Supportive Comfort Measures:**\n- Apply a warm heating pad to your lower abdomen or lower back to relax uterine muscles.\n- Drink warm chamomile or ginger tea, which possess natural anti-inflammatory properties.\n- Maintain a menstrual tracker recording flow duration, cycle intervals, and pain intensity.\n\n**When to Consult a Specialist:**\n- Pain that disrupts work or school despite rest\n- Heavy flow requiring pad changes every hour\n- Missed periods for multiple cycles or severe acne/hair changes suggestive of PCOS.\n\n*Recommended Specialty: Gynecologist.*`;
    } else if (query.includes('child') || query.includes('baby') || query.includes('infant')) {
      reply = `**Pediatric Health Guidance**\n\nChildren's developing immune systems require gentle, age-appropriate care.\n\n**Safety Guidelines:**\n- Never administer adult medications, unprescribed antibiotics, or Aspirin to children.\n- Focus on small, frequent sips of liquids (water, ORS, breastmilk) to preserve hydration.\n- Monitor overall alertness, playfulness, and diaper wetness.\n\n**Seek Immediate Pediatric Attention if:**\n- Baby is unusually lethargic, unresponsive, or breathing with flaring nostrils\n- Persistent vomiting or inability to keep fluids down for over 6 hours.\n\n*Recommended Specialty: Pediatrician.*`;
    } else {
      reply = `**Health Education & Care Navigation**\n\nThank you for reaching out to MediMate AI. Regarding your inquiry on: *"${latestUserMessage.substring(0, 80)}..."*\n\n**General Health Principles:**\n1. **Hydration & Rest:** Ample restful sleep and proper fluid intake remain fundamental to bodily recovery.\n2. **Symptom Tracking:** Note the onset, severity, and any aggravating or relieving factors so you can share an accurate history with your clinician.\n3. **Clinical Assessment:** If your symptoms have persisted for several days or are worsening, we recommend booking an appointment with an appropriate clinician via our Doctor Directory.\n\n*Tip: You can also use our 4 specialized modules on the Dashboard (Women's, Men's, Children's, Senior Health) for a complete personalized clinical intake and doctor recommendation!*`;
    }

    if (!apiKey) {
      reply += `\n\n*(Note: Operating in Built-in Clinical Knowledge Base mode. To enable dynamic live Gemini AI generation, add your \`GEMINI_API_KEY\` in \`.env.local\`)*`;
    }

    return NextResponse.json({ reply, isEmergency: false });
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    return NextResponse.json(
      { error: 'The AI health assistant is temporarily unable to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
