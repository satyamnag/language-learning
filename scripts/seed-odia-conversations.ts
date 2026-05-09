import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

// ---------- Conversation data (10 lines per level) ----------
const conversations = {
  "Very Beginner Level": [
    { order: 1, question: "ନମସ୍କାର ଭାଇ।", nativeText: "Hello brother.", speaker: "Person 1", directAnswer: "Namaskaar bhai.", audioSrc: "/odia/very_beginner_level/person1_01.mp3" },
    { order: 2, question: "ନମସ୍କାର ଦିଦି।", nativeText: "Hello sister.", speaker: "Person 2", directAnswer: "Namaskaar didi.", audioSrc: "/odia/very_beginner_level/person2_01.mp3" },
    { order: 3, question: "କେମିତି ଅଛ?", nativeText: "How are you?", speaker: "Person 1", directAnswer: "Kemiti achha?", audioSrc: "/odia/very_beginner_level/person1_02.mp3" },
    { order: 4, question: "ଭଲ ଅଛି।", nativeText: "I am fine.", speaker: "Person 2", directAnswer: "Bhala achhi.", audioSrc: "/odia/very_beginner_level/person2_02.mp3" },
    { order: 5, question: "କେଉଁଠି ଯାଉଛ?", nativeText: "Where are you going?", speaker: "Person 1", directAnswer: "Keunthi jauchha?", audioSrc: "/odia/very_beginner_level/person1_03.mp3" },
    { order: 6, question: "ବଜାର ଯାଉଛି।", nativeText: "I am going to the market.", speaker: "Person 2", directAnswer: "Bajaar jauchhi.", audioSrc: "/odia/very_beginner_level/person2_03.mp3" },
    { order: 7, question: "କଣ କିଣିବ?", nativeText: "What will you buy?", speaker: "Person 1", directAnswer: "Kana kiniba?", audioSrc: "/odia/very_beginner_level/person1_04.mp3" },
    { order: 8, question: "ସବ୍ଜି କିଣିବି।", nativeText: "I will buy vegetables.", speaker: "Person 2", directAnswer: "Sabji kinibi.", audioSrc: "/odia/very_beginner_level/person2_04.mp3" },
    { order: 9, question: "ଠିକ୍ ଅଛି।", nativeText: "Okay.", speaker: "Person 1", directAnswer: "Thik achhi.", audioSrc: "/odia/very_beginner_level/person1_05.mp3" },
    { order: 10, question: "ପୁଣି ଦେଖା।", nativeText: "See you again.", speaker: "Person 2", directAnswer: "Puni dekhaa.", audioSrc: "/odia/very_beginner_level/person2_05.mp3" },
  ],
  "Beginner Level": [
    { order: 1, question: "ତୁମ ନାମ କଣ?", nativeText: "What is your name?", speaker: "Person 1", directAnswer: "Tuma naam kana?", audioSrc: "/odia/beginner_level/person1_01.mp3" },
    { order: 2, question: "ମୋ ନାମ ରାହୁଲ।", nativeText: "My name is Rahul.", speaker: "Person 2", directAnswer: "Mo naam Rahul.", audioSrc: "/odia/beginner_level/person2_01.mp3" },
    { order: 3, question: "କେଉଁଠି ରୁହୁଛ?", nativeText: "Where do you live?", speaker: "Person 1", directAnswer: "Keunthi ruhuchha?", audioSrc: "/odia/beginner_level/person1_02.mp3" },
    { order: 4, question: "ମୁଁ କଟକରେ ରୁହୁଛି।", nativeText: "I live in Cuttack.", speaker: "Person 2", directAnswer: "Mu Cuttackre ruhuchhi.", audioSrc: "/odia/beginner_level/person2_02.mp3" },
    { order: 5, question: "ତୁମେ କଣ କରୁଛ?", nativeText: "What do you do?", speaker: "Person 1", directAnswer: "Tume kana karuchha?", audioSrc: "/odia/beginner_level/person1_03.mp3" },
    { order: 6, question: "ମୁଁ ପଢ଼ୁଛି।", nativeText: "I study.", speaker: "Person 2", directAnswer: "Mu padhuchhi.", audioSrc: "/odia/beginner_level/person2_03.mp3" },
    { order: 7, question: "କେଉଁ ଶ୍ରେଣୀରେ ପଢ଼ୁଛ?", nativeText: "In which class do you study?", speaker: "Person 1", directAnswer: "Keun shrenire padhuchha?", audioSrc: "/odia/beginner_level/person1_04.mp3" },
    { order: 8, question: "ଦଶମ ଶ୍ରେଣୀରେ ପଢ଼ୁଛି।", nativeText: "I study in the tenth class.", speaker: "Person 2", directAnswer: "Dashama shrenire padhuchhi.", audioSrc: "/odia/beginner_level/person2_04.mp3" },
    { order: 9, question: "ଭଲ କଥା ଅଟେ।", nativeText: "That is good.", speaker: "Person 1", directAnswer: "Bhala katha ate.", audioSrc: "/odia/beginner_level/person1_05.mp3" },
    { order: 10, question: "ଧନ୍ୟବାଦ ବନ୍ଧୁ।", nativeText: "Thank you, friend.", speaker: "Person 2", directAnswer: "Dhanyabaad bandhu.", audioSrc: "/odia/beginner_level/person2_05.mp3" },
  ],
  "Intermediate Level": [
    { order: 1, question: "ଆଜି ସକାଳେ କେଉଁଠି ଯାଇଥିଲ?", nativeText: "Where did you go this morning?", speaker: "Person 1", directAnswer: "Aaji sakaale keunthi jaaithila?", audioSrc: "/odia/intermediate_level/person1_01.mp3" },
    { order: 2, question: "ମୁଁ ମନ୍ଦିରକୁ ଯାଇଥିଲି।", nativeText: "I had gone to the temple.", speaker: "Person 2", directAnswer: "Mu mandiraku jaaithili.", audioSrc: "/odia/intermediate_level/person2_01.mp3" },
    { order: 3, question: "ସେଠାରେ ଭିଡ଼ ଥିଲା କି?", nativeText: "Was there a crowd there?", speaker: "Person 1", directAnswer: "Sethaare bhida thila ki?", audioSrc: "/odia/intermediate_level/person1_02.mp3" },
    { order: 4, question: "ହଁ, ବହୁତ ଭିଡ଼ ଥିଲା।", nativeText: "Yes, there was a big crowd.", speaker: "Person 2", directAnswer: "Han, bahuta bhida thila.", audioSrc: "/odia/intermediate_level/person2_02.mp3" },
    { order: 5, question: "ପୂଜା କେବେ ଆରମ୍ଭ ହେଲା?", nativeText: "When did the prayer start?", speaker: "Person 1", directAnswer: "Pujaa kebe aarambha hela?", audioSrc: "/odia/intermediate_level/person1_03.mp3" },
    { order: 6, question: "ସକାଳ ଆଠଟାରେ ଆରମ୍ଭ ହେଲା।", nativeText: "It started at eight in the morning.", speaker: "Person 2", directAnswer: "Sakaala aathataare aarambha hela.", audioSrc: "/odia/intermediate_level/person2_03.mp3" },
    { order: 7, question: "ପ୍ରସାଦ ନେଇଆସିଲ କି?", nativeText: "Did you bring prasad?", speaker: "Person 1", directAnswer: "Prasaada nei aasila ki?", audioSrc: "/odia/intermediate_level/person1_04.mp3" },
    { order: 8, question: "ହଁ, ଘର ପାଇଁ ଆଣିଲି।", nativeText: "Yes, I brought it for home.", speaker: "Person 2", directAnswer: "Han, ghara paain aanili.", audioSrc: "/odia/intermediate_level/person2_04.mp3" },
    { order: 9, question: "ବହୁତ ଭଲ କରିଲ।", nativeText: "You did very well.", speaker: "Person 1", directAnswer: "Bahuta bhala karila.", audioSrc: "/odia/intermediate_level/person1_05.mp3" },
    { order: 10, question: "ସମସ୍ତେ ଖୁସି ହେବେ।", nativeText: "Everyone will be happy.", speaker: "Person 2", directAnswer: "Samaste khusi hebe.", audioSrc: "/odia/intermediate_level/person2_05.mp3" },
  ],
  "Upper Intermediate Level": [
    { order: 1, question: "ଆଜି ତୁମେ ଅଫିସକୁ ଦେରି କାହିଁକି ଆସିଲ?", nativeText: "Why did you come late to the office today?", speaker: "Person 1", directAnswer: "Aaji tume officeku deri kahinki aasila?", audioSrc: "/odia/upper_intermediate_level/person1_01.mp3" },
    { order: 2, question: "ରାସ୍ତାରେ ବହୁତ ଟ୍ରାଫିକ୍ ଥିଲା।", nativeText: "There was heavy traffic on the road.", speaker: "Person 2", directAnswer: "Raastaare bahuta traffic thila.", audioSrc: "/odia/upper_intermediate_level/person2_01.mp3" },
    { order: 3, question: "ବର୍ଷା ପାଇଁ ରାସ୍ତା ଭରିଯାଇଥିଲା କି?", nativeText: "Was the road flooded because of the rain?", speaker: "Person 1", directAnswer: "Barshaa paain raastaa bharijaithila ki?", audioSrc: "/odia/upper_intermediate_level/person1_02.mp3" },
    { order: 4, question: "ହଁ, ଅନେକ ଜାଗାରେ ପାଣି ଜମିଥିଲା।", nativeText: "Yes, water had collected in many places.", speaker: "Person 2", directAnswer: "Han, aneka jaagaare paani jamithila.", audioSrc: "/odia/upper_intermediate_level/person2_02.mp3" },
    { order: 5, question: "ତାହେଲେ ବହୁତ ଅସୁବିଧା ହୋଇଥିବ।", nativeText: "Then it must have been very difficult.", speaker: "Person 1", directAnswer: "Taahale bahuta asubidhaa hoithiba.", audioSrc: "/odia/upper_intermediate_level/person1_03.mp3" },
    { order: 6, question: "ହଁ, ଗାଡ଼ି ଧୀରେ ଚାଲୁଥିଲା।", nativeText: "Yes, the vehicles were moving slowly.", speaker: "Person 2", directAnswer: "Han, gaadi dheere chaaluthila.", audioSrc: "/odia/upper_intermediate_level/person2_03.mp3" },
    { order: 7, question: "ତୁମେ ଖାଇବା ନେଇଆସିଛ କି?", nativeText: "Did you bring food?", speaker: "Person 1", directAnswer: "Tume khaaibaa nei aasichha ki?", audioSrc: "/odia/upper_intermediate_level/person1_04.mp3" },
    { order: 8, question: "ନାହିଁ, ଆଜି ଘରେ ସମୟ ମିଳିଲାନି।", nativeText: "No, I did not get time at home today.", speaker: "Person 2", directAnswer: "Naahin, aaji ghare samaya mililaani.", audioSrc: "/odia/upper_intermediate_level/person2_04.mp3" },
    { order: 9, question: "ଚଳ, ଆମେ ସଙ୍ଗେ ଖାଇବା।", nativeText: "Come, let us eat together.", speaker: "Person 1", directAnswer: "Chala, aame sange khaaibaa.", audioSrc: "/odia/upper_intermediate_level/person1_05.mp3" },
    { order: 10, question: "ଠିକ୍ ଅଛି, ଚଳ ଯିବା।", nativeText: "Okay, let us go.", speaker: "Person 2", directAnswer: "Thik achhi, chala jibaa.", audioSrc: "/odia/upper_intermediate_level/person2_05.mp3" },
  ],
  "Advanced Level": [
    { order: 1, question: "ତୁମେ ଆଜି ବହୁତ ଚିନ୍ତିତ ଲାଗୁଛ।", nativeText: "You look very worried today.", speaker: "Person 1", directAnswer: "Tume aaji bahuta chintita laaguchha.", audioSrc: "/odia/advanced_level/person1_01.mp3" },
    { order: 2, question: "କାଲି ମୋର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପରୀକ୍ଷା ଅଛି।", nativeText: "I have an important exam tomorrow.", speaker: "Person 2", directAnswer: "Kaali mora gurutwapurna parikshaa achhi.", audioSrc: "/odia/advanced_level/person2_01.mp3" },
    { order: 3, question: "ପଢ଼ା ଠିକ୍ ଭାବରେ ସରିଛି କି?", nativeText: "Have you completed your studies properly?", speaker: "Person 1", directAnswer: "Padhaa thik bhaabare sarichhi ki?", audioSrc: "/odia/advanced_level/person1_02.mp3" },
    { order: 4, question: "କିଛି ବିଷୟ ଏଯାବତ୍ ବାକି ଅଛି।", nativeText: "Some subjects are still left.", speaker: "Person 2", directAnswer: "Kichhi bishaya eyajabata baaki achhi.", audioSrc: "/odia/advanced_level/person2_02.mp3" },
    { order: 5, question: "ଚିନ୍ତା କରନି, ସବୁ ଭଲ ହେବ।", nativeText: "Do not worry, everything will be fine.", speaker: "Person 1", directAnswer: "Chintaa karani, sabu bhala heba.", audioSrc: "/odia/advanced_level/person1_03.mp3" },
    { order: 6, question: "ତୁମ କଥା ଶୁଣି ଭଲ ଲାଗିଲା।", nativeText: "I felt good after hearing your words.", speaker: "Person 2", directAnswer: "Tuma kathaa shuni bhala laagilaa.", audioSrc: "/odia/advanced_level/person2_03.mp3" },
    { order: 7, question: "ଆଜି ରାତିରେ ଭଲରେ ବିଶ୍ରାମ କର।", nativeText: "Take proper rest tonight.", speaker: "Person 1", directAnswer: "Aaji raatire bhalare bishraama kara.", audioSrc: "/odia/advanced_level/person1_04.mp3" },
    { order: 8, question: "ହଁ, ମୁଁ ସମୟରେ ଶୋଇପଡ଼ିବି।", nativeText: "Yes, I will go to bed on time.", speaker: "Person 2", directAnswer: "Han, mu samayare shoipadibi.", audioSrc: "/odia/advanced_level/person2_04.mp3" },
    { order: 9, question: "କାଲି ଆତ୍ମବିଶ୍ୱାସ ସହିତ ପରୀକ୍ଷା ଦେବ।", nativeText: "Tomorrow, take the exam with confidence.", speaker: "Person 1", directAnswer: "Kaali aatmabishwaasa sahita parikshaa deba.", audioSrc: "/odia/advanced_level/person1_05.mp3" },
    { order: 10, question: "ନିଶ୍ଚୟ, ମୁଁ ଭଲ ଚେଷ୍ଟା କରିବି।", nativeText: "Certainly, I will try my best.", speaker: "Person 2", directAnswer: "Nishchaya, mu bhala cheshtaa karibi.", audioSrc: "/odia/advanced_level/person2_05.mp3" },
  ],
};

const main = async () => {
  try {
    console.log("🔍 Looking for the Odia course and unit...");

    // 1. Find the Odia course
    const odiaCourse = await db.query.courses.findFirst({
      where: eq(schema.courses.id, 3),   // You said ID = 3
    });
    if (!odiaCourse) {
      console.error("❌ Odia course (ID 3) not found.");
      process.exit(1);
    }
    console.log(`✅ Odia course: ${odiaCourse.title} (ID ${odiaCourse.id})`);

    // 2. Find the Everyday Conversations in Odia unit (ID 3)
    const odiaUnit = await db.query.units.findFirst({
      where: eq(schema.units.id, 3),
    });
    if (!odiaUnit) {
      console.error("❌ Unit 'Everyday Conversations in Odia' (ID 3) not found.");
      process.exit(1);
    }
    console.log(`✅ Unit: ${odiaUnit.title} (ID ${odiaUnit.id})`);

    // 3. For each lesson title, find or skip
    for (const [lessonTitle, challenges] of Object.entries(conversations)) {
      const lesson = await db.query.lessons.findFirst({
        where: and(
          eq(schema.lessons.unitId, odiaUnit.id),
          eq(schema.lessons.title, lessonTitle)
        ),
      });

      if (!lesson) {
        console.warn(`⚠️  Lesson "${lessonTitle}" not found in unit ID ${odiaUnit.id}. Skipping.`);
        continue;
      }

      // 4. Insert challenges that don't already exist
      const existingOrders = (
        await db.query.challenges.findMany({
          where: eq(schema.challenges.lessonId, lesson.id),
          columns: { order: true },
        })
      ).map((c) => c.order);

      const challengesToInsert = challenges
        .filter((c) => !existingOrders.includes(c.order))
        .map((c) => ({
          lessonId: lesson.id,
          type: "ASSIST" as const,
          order: c.order,
          question: c.question,
          nativeText: c.nativeText,
          speaker: c.speaker,
          directAnswer: c.directAnswer,
          audioSrc: c.audioSrc,
        }));

      if (challengesToInsert.length > 0) {
        await db.insert(schema.challenges).values(challengesToInsert);
        console.log(`✅ Inserted ${challengesToInsert.length} challenges for "${lessonTitle}"`);
      } else {
        console.log(`ℹ️  "${lessonTitle}" already has all challenges.`);
      }
    }

    console.log("🎉 All conversation challenges seeded successfully.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

main();