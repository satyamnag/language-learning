// import "dotenv/config";
// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";

// import * as schema from "../db/schema";

// const sql = neon(process.env.DATABASE_URL!); 
// // @ts-ignore
// const db = drizzle(sql, { schema });

// const main = async () => {
//   try {
//     console.log("Seeding database");

//     await db.delete(schema.courses);
//     await db.delete(schema.userProgress);
//     await db.delete(schema.units);
//     await db.delete(schema.lessons);
//     await db.delete(schema.challenges);
//     await db.delete(schema.challengeOptions);
//     await db.delete(schema.challengeProgress);
//     await db.delete(schema.userSubscription);

//     // ✅ Insert courses with sourceLanguage (default English)
//     await db.insert(schema.courses).values([
//       { id: 1, title: "Spanish", sourceLanguage: "en" },
//       { id: 2, title: "Italian", sourceLanguage: "en" },
//       { id: 3, title: "French", sourceLanguage: "en" },
//       { id: 4, title: "Croatian", sourceLanguage: "en" },
//     ]);

//     await db.insert(schema.units).values([
//       {
//         id: 1,
//         courseId: 1, // Spanish
//         title: "Unit 1",
//         description: "Learn the basics of Spanish",
//         order: 1,
//       }
//     ]);

//     await db.insert(schema.lessons).values([
//       {
//         id: 1,
//         unitId: 1, // Unit 1 (Learn the basics...)
//         order: 1,
//         title: "Nouns",
//       },
//       {
//         id: 2,
//         unitId: 1, // Unit 1 (Learn the basics...)
//         order: 2,
//         title: "Verbs",
//       },
//       {
//         id: 3,
//         unitId: 1, // Unit 1 (Learn the basics...)
//         order: 3,
//         title: "Verbs",
//       },
//       {
//         id: 4,
//         unitId: 1, // Unit 1 (Learn the basics...)
//         order: 4,
//         title: "Verbs",
//       },
//       {
//         id: 5,
//         unitId: 1, // Unit 1 (Learn the basics...)
//         order: 5,
//         title: "Verbs",
//       },
//     ]);

//     await db.insert(schema.challenges).values([
//       {
//         id: 1,
//         lessonId: 1, // Nouns
//         type: "SELECT",
//         order: 1,
//         question: 'Which one of these is the "the man"?',
//       },
//       {
//         id: 2,
//         lessonId: 1, // Nouns
//         type: "ASSIST",
//         order: 2,
//         question: '"the man"',
//       },
//       {
//         id: 3,
//         lessonId: 1, // Nouns
//         type: "SELECT",
//         order: 3,
//         question: 'Which one of these is the "the robot"?',
//       },
//     ]);

//     await db.insert(schema.challengeOptions).values([
//       {
//         challengeId: 2, // "the man"?
//         correct: true,
//         text: "el hombre",
//         audioSrc: "/es_man.mp3",
//       },
//       {
//         challengeId: 2,
//         correct: false,
//         text: "la mujer",
//         audioSrc: "/es_woman.mp3",
//       },
//       {
//         challengeId: 2,
//         correct: false,
//         text: "el robot",
//         audioSrc: "/es_robot.mp3",
//       },
//     ]);

//     await db.insert(schema.challenges).values([
//       {
//         id: 4,
//         lessonId: 2, // Verbs
//         type: "SELECT",
//         order: 1,
//         question: 'Which one of these is the "the man"?',
//       },
//       {
//         id: 5,
//         lessonId: 2, // Verbs
//         type: "ASSIST",
//         order: 2,
//         question: '"the man"',
//       },
//       {
//         id: 6,
//         lessonId: 2, // Verbs
//         type: "SELECT",
//         order: 3,
//         question: 'Which one of these is the "the robot"?',
//       },
//     ]);
//     console.log("Seeding finished");
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to seed the database");
//   }
// };

// main();






import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Odia conversations (no existing data deleted)");

    // 1. Insert the Odia course if it doesn't already exist
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Odia"),
    });
    let courseId = existingCourse?.id;
    if (!courseId) {
      const [newCourse] = await db
        .insert(schema.courses)
        .values({ title: "Odia", sourceLanguage: "en" })
        .returning({ id: schema.courses.id });
      courseId = newCourse.id;
      console.log(`✅ Created Odia course with ID ${courseId}`);
    } else {
      console.log(`ℹ️  Odia course already exists (ID ${courseId})`);
    }

    // 2. Insert the Odia unit if it doesn't already exist
    const existingUnit = await db.query.units.findFirst({
      where: (units, { and, eq }) =>
        and(eq(units.courseId, courseId), eq(units.title, "Unit 1")),
    });
    let unitId = existingUnit?.id;
    if (!unitId) {
      const [newUnit] = await db
        .insert(schema.units)
        .values({
          courseId,
          title: "Unit 1",
          description: "Learn the basics of Odia",
          order: 1,
        })
        .returning({ id: schema.units.id });
      unitId = newUnit.id;
      console.log(`✅ Created Odia Unit 1 with ID ${unitId}`);
    } else {
      console.log(`ℹ️  Odia Unit 1 already exists (ID ${unitId})`);
    }

    // 3. Insert the Conversations lesson if it doesn't already exist
    const existingLesson = await db.query.lessons.findFirst({
      where: (lessons, { and, eq }) =>
        and(eq(lessons.unitId, unitId), eq(lessons.title, "Conversations")),
    });
    let lessonId = existingLesson?.id;
    if (!lessonId) {
      const [newLesson] = await db
        .insert(schema.lessons)
        .values({
          unitId,
          order: 1,
          title: "Conversations",
        })
        .returning({ id: schema.lessons.id });
      lessonId = newLesson.id;
      console.log(`✅ Created Conversations lesson with ID ${lessonId}`);
    } else {
      console.log(`ℹ️  Conversations lesson already exists (ID ${lessonId})`);
    }

    // 4. Insert all 50 conversation challenges (only if lesson is new or we ensure no duplicates)
    // We'll use the lesson ID and order to avoid inserting the same challenge twice.
    const existingChallenges = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lessonId),
      columns: { order: true },
    });
    const existingOrders = new Set(existingChallenges.map((c) => c.order));

    const odiaConversations = [
      // Conversation 1 — Very Beginner
      { lessonId, type: "ASSIST" as const, order: 1, question: "ନମସ୍କାର ଭାଇ।", nativeText: "Hello brother.", speaker: "Person 1", directAnswer: "Namaskaar bhai.", audioSrc: "/odia/very_beginner_level/person1_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 2, question: "ନମସ୍କାର ଦିଦି।", nativeText: "Hello sister.", speaker: "Person 2", directAnswer: "Namaskaar didi.", audioSrc: "/odia/very_beginner_level/person2_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 3, question: "କେମିତି ଅଛ?", nativeText: "How are you?", speaker: "Person 1", directAnswer: "Kemiti achha?", audioSrc: "/odia/very_beginner_level/person1_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 4, question: "ଭଲ ଅଛି।", nativeText: "I am fine.", speaker: "Person 2", directAnswer: "Bhala achhi.", audioSrc: "/odia/very_beginner_level/person2_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 5, question: "କେଉଁଠି ଯାଉଛ?", nativeText: "Where are you going?", speaker: "Person 1", directAnswer: "Keunthi jauchha?", audioSrc: "/odia/very_beginner_level/person1_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 6, question: "ବଜାର ଯାଉଛି।", nativeText: "I am going to the market.", speaker: "Person 2", directAnswer: "Bajaar jauchhi.", audioSrc: "/odia/very_beginner_level/person2_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 7, question: "କଣ କିଣିବ?", nativeText: "What will you buy?", speaker: "Person 1", directAnswer: "Kana kiniba?", audioSrc: "/odia/very_beginner_level/person1_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 8, question: "ସବ୍ଜି କିଣିବି।", nativeText: "I will buy vegetables.", speaker: "Person 2", directAnswer: "Sabji kinibi.", audioSrc: "/odia/very_beginner_level/person2_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 9, question: "ଠିକ୍ ଅଛି।", nativeText: "Okay.", speaker: "Person 1", directAnswer: "Thik achhi.", audioSrc: "/odia/very_beginner_level/person1_05.mp3" },
      { lessonId, type: "ASSIST" as const, order: 10, question: "ପୁଣି ଦେଖା।", nativeText: "See you again.", speaker: "Person 2", directAnswer: "Puni dekhaa.", audioSrc: "/odia/very_beginner_level/person2_05.mp3" },

      // Conversation 2 — Beginner
      { lessonId, type: "ASSIST" as const, order: 11, question: "ତୁମ ନାମ କଣ?", nativeText: "What is your name?", speaker: "Person 1", directAnswer: "Tuma naam kana?", audioSrc: "/odia/beginner_level/person1_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 12, question: "ମୋ ନାମ ରାହୁଲ।", nativeText: "My name is Rahul.", speaker: "Person 2", directAnswer: "Mo naam Rahul.", audioSrc: "/odia/beginner_level/person2_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 13, question: "କେଉଁଠି ରୁହୁଛ?", nativeText: "Where do you live?", speaker: "Person 1", directAnswer: "Keunthi ruhuchha?", audioSrc: "/odia/beginner_level/person1_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 14, question: "ମୁଁ କଟକରେ ରୁହୁଛି।", nativeText: "I live in Cuttack.", speaker: "Person 2", directAnswer: "Mu Cuttackre ruhuchhi.", audioSrc: "/odia/beginner_level/person2_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 15, question: "ତୁମେ କଣ କରୁଛ?", nativeText: "What do you do?", speaker: "Person 1", directAnswer: "Tume kana karuchha?", audioSrc: "/odia/beginner_level/person1_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 16, question: "ମୁଁ ପଢ଼ୁଛି।", nativeText: "I study.", speaker: "Person 2", directAnswer: "Mu padhuchhi.", audioSrc: "/odia/beginner_level/person2_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 17, question: "କେଉଁ ଶ୍ରେଣୀରେ ପଢ଼ୁଛ?", nativeText: "In which class do you study?", speaker: "Person 1", directAnswer: "Keun shrenire padhuchha?", audioSrc: "/odia/beginner_level/person1_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 18, question: "ଦଶମ ଶ୍ରେଣୀରେ ପଢ଼ୁଛି।", nativeText: "I study in the tenth class.", speaker: "Person 2", directAnswer: "Dashama shrenire padhuchhi.", audioSrc: "/odia/beginner_level/person2_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 19, question: "ଭଲ କଥା ଅଟେ।", nativeText: "That is good.", speaker: "Person 1", directAnswer: "Bhala katha ate.", audioSrc: "/odia/beginner_level/person1_05.mp3" },
      { lessonId, type: "ASSIST" as const, order: 20, question: "ଧନ୍ୟବାଦ ବନ୍ଧୁ।", nativeText: "Thank you, friend.", speaker: "Person 2", directAnswer: "Dhanyabaad bandhu.", audioSrc: "/odia/beginner_level/person2_05.mp3" },

      // Conversation 3 — Intermediate
      { lessonId, type: "ASSIST" as const, order: 21, question: "ଆଜି ସକାଳେ କେଉଁଠି ଯାଇଥିଲ?", nativeText: "Where did you go this morning?", speaker: "Person 1", directAnswer: "Aaji sakaale keunthi jaaithila?", audioSrc: "/odia/intermediate_level/person1_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 22, question: "ମୁଁ ମନ୍ଦିରକୁ ଯାଇଥିଲି।", nativeText: "I had gone to the temple.", speaker: "Person 2", directAnswer: "Mu mandiraku jaaithili.", audioSrc: "/odia/intermediate_level/person2_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 23, question: "ସେଠାରେ ଭିଡ଼ ଥିଲା କି?", nativeText: "Was there a crowd there?", speaker: "Person 1", directAnswer: "Sethaare bhida thila ki?", audioSrc: "/odia/intermediate_level/person1_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 24, question: "ହଁ, ବହୁତ ଭିଡ଼ ଥିଲା।", nativeText: "Yes, there was a big crowd.", speaker: "Person 2", directAnswer: "Han, bahuta bhida thila.", audioSrc: "/odia/intermediate_level/person2_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 25, question: "ପୂଜା କେବେ ଆରମ୍ଭ ହେଲା?", nativeText: "When did the prayer start?", speaker: "Person 1", directAnswer: "Pujaa kebe aarambha hela?", audioSrc: "/odia/intermediate_level/person1_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 26, question: "ସକାଳ ଆଠଟାରେ ଆରମ୍ଭ ହେଲା।", nativeText: "It started at eight in the morning.", speaker: "Person 2", directAnswer: "Sakaala aathataare aarambha hela.", audioSrc: "/odia/intermediate_level/person2_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 27, question: "ପ୍ରସାଦ ନେଇଆସିଲ କି?", nativeText: "Did you bring prasad?", speaker: "Person 1", directAnswer: "Prasaada nei aasila ki?", audioSrc: "/odia/intermediate_level/person1_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 28, question: "ହଁ, ଘର ପାଇଁ ଆଣିଲି।", nativeText: "Yes, I brought it for home.", speaker: "Person 2", directAnswer: "Han, ghara paain aanili.", audioSrc: "/odia/intermediate_level/person2_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 29, question: "ବହୁତ ଭଲ କରିଲ।", nativeText: "You did very well.", speaker: "Person 1", directAnswer: "Bahuta bhala karila.", audioSrc: "/odia/intermediate_level/person1_05.mp3" },
      { lessonId, type: "ASSIST" as const, order: 30, question: "ସମସ୍ତେ ଖୁସି ହେବେ।", nativeText: "Everyone will be happy.", speaker: "Person 2", directAnswer: "Samaste khusi hebe.", audioSrc: "/odia/intermediate_level/person2_05.mp3" },

      // Conversation 4 — Upper Intermediate
      { lessonId, type: "ASSIST" as const, order: 31, question: "ଆଜି ତୁମେ ଅଫିସକୁ ଦେରି କାହିଁକି ଆସିଲ?", nativeText: "Why did you come late to the office today?", speaker: "Person 1", directAnswer: "Aaji tume officeku deri kahinki aasila?", audioSrc: "/odia/upper_intermediate_level/person1_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 32, question: "ରାସ୍ତାରେ ବହୁତ ଟ୍ରାଫିକ୍ ଥିଲା।", nativeText: "There was heavy traffic on the road.", speaker: "Person 2", directAnswer: "Raastaare bahuta traffic thila.", audioSrc: "/odia/upper_intermediate_level/person2_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 33, question: "ବର୍ଷା ପାଇଁ ରାସ୍ତା ଭରିଯାଇଥିଲା କି?", nativeText: "Was the road flooded because of the rain?", speaker: "Person 1", directAnswer: "Barshaa paain raastaa bharijaithila ki?", audioSrc: "/odia/upper_intermediate_level/person1_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 34, question: "ହଁ, ଅନେକ ଜାଗାରେ ପାଣି ଜମିଥିଲା।", nativeText: "Yes, water had collected in many places.", speaker: "Person 2", directAnswer: "Han, aneka jaagaare paani jamithila.", audioSrc: "/odia/upper_intermediate_level/person2_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 35, question: "ତାହେଲେ ବହୁତ ଅସୁବିଧା ହୋଇଥିବ।", nativeText: "Then it must have been very difficult.", speaker: "Person 1", directAnswer: "Taahale bahuta asubidhaa hoithiba.", audioSrc: "/odia/upper_intermediate_level/person1_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 36, question: "ହଁ, ଗାଡ଼ି ଧୀରେ ଚାଲୁଥିଲା।", nativeText: "Yes, the vehicles were moving slowly.", speaker: "Person 2", directAnswer: "Han, gaadi dheere chaaluthila.", audioSrc: "/odia/upper_intermediate_level/person2_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 37, question: "ତୁମେ ଖାଇବା ନେଇଆସିଛ କି?", nativeText: "Did you bring food?", speaker: "Person 1", directAnswer: "Tume khaaibaa nei aasichha ki?", audioSrc: "/odia/upper_intermediate_level/person1_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 38, question: "ନାହିଁ, ଆଜି ଘରେ ସମୟ ମିଳିଲାନି।", nativeText: "No, I did not get time at home today.", speaker: "Person 2", directAnswer: "Naahin, aaji ghare samaya mililaani.", audioSrc: "/odia/upper_intermediate_level/person2_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 39, question: "ଚଳ, ଆମେ ସଙ୍ଗେ ଖାଇବା।", nativeText: "Come, let us eat together.", speaker: "Person 1", directAnswer: "Chala, aame sange khaaibaa.", audioSrc: "/odia/upper_intermediate_level/person1_05.mp3" },
      { lessonId, type: "ASSIST" as const, order: 40, question: "ଠିକ୍ ଅଛି, ଚଳ ଯିବା।", nativeText: "Okay, let us go.", speaker: "Person 2", directAnswer: "Thik achhi, chala jibaa.", audioSrc: "/odia/upper_intermediate_level/person2_05.mp3" },

      // Conversation 5 — Advanced
      { lessonId, type: "ASSIST" as const, order: 41, question: "ତୁମେ ଆଜି ବହୁତ ଚିନ୍ତିତ ଲାଗୁଛ।", nativeText: "You look very worried today.", speaker: "Person 1", directAnswer: "Tume aaji bahuta chintita laaguchha.", audioSrc: "/odia/advanced_level/person1_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 42, question: "କାଲି ମୋର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପରୀକ୍ଷା ଅଛି।", nativeText: "I have an important exam tomorrow.", speaker: "Person 2", directAnswer: "Kaali mora gurutwapurna parikshaa achhi.", audioSrc: "/odia/advanced_level/person2_01.mp3" },
      { lessonId, type: "ASSIST" as const, order: 43, question: "ପଢ଼ା ଠିକ୍ ଭାବରେ ସରିଛି କି?", nativeText: "Have you completed your studies properly?", speaker: "Person 1", directAnswer: "Padhaa thik bhaabare sarichhi ki?", audioSrc: "/odia/advanced_level/person1_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 44, question: "କିଛି ବିଷୟ ଏଯାବତ୍ ବାକି ଅଛି।", nativeText: "Some subjects are still left.", speaker: "Person 2", directAnswer: "Kichhi bishaya eyajabata baaki achhi.", audioSrc: "/odia/advanced_level/person2_02.mp3" },
      { lessonId, type: "ASSIST" as const, order: 45, question: "ଚିନ୍ତା କରନି, ସବୁ ଭଲ ହେବ।", nativeText: "Do not worry, everything will be fine.", speaker: "Person 1", directAnswer: "Chintaa karani, sabu bhala heba.", audioSrc: "/odia/advanced_level/person1_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 46, question: "ତୁମ କଥା ଶୁଣି ଭଲ ଲାଗିଲା।", nativeText: "I felt good after hearing your words.", speaker: "Person 2", directAnswer: "Tuma kathaa shuni bhala laagilaa.", audioSrc: "/odia/advanced_level/person2_03.mp3" },
      { lessonId, type: "ASSIST" as const, order: 47, question: "ଆଜି ରାତିରେ ଭଲରେ ବିଶ୍ରାମ କର।", nativeText: "Take proper rest tonight.", speaker: "Person 1", directAnswer: "Aaji raatire bhalare bishraama kara.", audioSrc: "/odia/advanced_level/person1_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 48, question: "ହଁ, ମୁଁ ସମୟରେ ଶୋଇପଡ଼ିବି।", nativeText: "Yes, I will go to bed on time.", speaker: "Person 2", directAnswer: "Han, mu samayare shoipadibi.", audioSrc: "/odia/advanced_level/person2_04.mp3" },
      { lessonId, type: "ASSIST" as const, order: 49, question: "କାଲି ଆତ୍ମବିଶ୍ୱାସ ସହିତ ପରୀକ୍ଷା ଦେବ।", nativeText: "Tomorrow, take the exam with confidence.", speaker: "Person 1", directAnswer: "Kaali aatmabishwaasa sahita parikshaa deba.", audioSrc: "/odia/advanced_level/person1_05.mp3" },
      { lessonId, type: "ASSIST" as const, order: 50, question: "ନିଶ୍ଚୟ, ମୁଁ ଭଲ ଚେଷ୍ଟା କରିବି।", nativeText: "Certainly, I will try my best.", speaker: "Person 2", directAnswer: "Nishchaya, mu bhala cheshtaa karibi.", audioSrc: "/odia/advanced_level/person2_05.mp3" },
    ];

    // Filter out any challenges that already exist (based on lessonId + order)
    const newChallenges = odiaConversations.filter(
      (c) => !existingOrders.has(c.order)
    );

    if (newChallenges.length > 0) {
      await db.insert(schema.challenges).values(newChallenges);
      console.log(`✅ Inserted ${newChallenges.length} new conversation challenges.`);
    } else {
      console.log("ℹ️  All conversation challenges already exist.");
    }

    console.log("🎉 Odia conversations seeding complete (no existing data deleted).");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed Odia conversations");
  }
};

main();