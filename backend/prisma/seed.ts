import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clean up existing data in correct order (to avoid FK violations)
  await prisma.chapterProgress.deleteMany({});
  await prisma.courseProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.courseAttachment.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.courseSection.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.instructor.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('🧹 Cleared existing data');

  // CATEGORIES (10 entries)
  const categoryData = Array.from({ length: 10 }, (_, i) => ({
    id: `cat_${i + 1}`,
    name: `Category ${i + 1}`,
  }));
  const categories = await prisma.category.createMany({
    data: categoryData,
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${categories.count} categories`);

  // USERS (10 entries)
  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: `password123`, // Note: In production, hash passwords!
        },
      })
    )
  );
  console.log(`✅ Created ${users.length} users`);

  // INSTRUCTORS (10 entries)
  const instructors = await Promise.all(
    users.map((user) =>
      prisma.instructor.create({
        data: {
          userId: user.id,
          bio: null,
          expertise: ['Math', 'Science'], // Valid array if schema defines String[]
          socialLinks: { twitter: 'https://twitter.com/example ' }, // Trimmed URL
        },
      })
    )
  );
  console.log(`✅ Created ${instructors.length} instructors`);

  // COURSES (10 entries)
  const courses = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.course.create({
        data: {
          id: `course_${i + 1}`,
          title: `Course ${i + 1}`,
          description: `Description for Course ${i + 1}`,
          categoryId: `cat_${(i % 10) + 1}`,
          instructorId: instructors[i].userId, // Use userId as instructorId
        },
      })
    )
  );
  console.log(`✅ Created ${courses.length} courses`);

  // COURSE SECTIONS (10 entries)
  const sections = await Promise.all(
    courses.map((course, i) =>
      prisma.courseSection.create({
        data: {
          id: `section_${i + 1}`,
          title: `Section for Course ${course.id}`,
          courseId: course.id,
          position: i + 1,
        },
      })
    )
  );
  console.log(`✅ Created ${sections.length} course sections`);

  // CHAPTERS (10 entries)
  const chapters = await Promise.all(
    sections.map((section, i) =>
      prisma.chapter.create({
        data: {
          id: `chapter_${i + 1}`,
          title: `Chapter for Section ${section.id}`,
          content: `Content for Chapter ${section.id}`,
          sectionId: section.id,
          courseId: section.courseId,
          position: i + 1,
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${chapters.length} chapters`);

  // CHAPTER PROGRESS (10 entries)
  const chapterProgresses = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.chapterProgress.create({
        data: {
          id: `progress_${i + 1}`,
          userId: users[i].id,
          chapterId: chapters[i].id,
          isCompleted: i % 2 === 0,
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${chapterProgresses.length} chapter progresses`);

  // COURSE ATTACHMENTS (10 entries)
  const attachments = await Promise.all(
    courses.map((course, i) =>
      prisma.courseAttachment.create({
        data: {
          id: `attachment_${i + 1}`,
          name: `Attachment ${i + 1}`,
          url: `https://example.com/attachment ${i + 1}.pdf`, // Valid URL
          courseId: course.id,
          instructorId: course.instructorId as string,
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${attachments.length} course attachments`);

  // REVIEWS (10 entries)
  const reviews = await Promise.all(
    courses.map((course, i) =>
      prisma.review.create({
        data: {
          id: `review_${i + 1}`,
          rating: (i % 5) + 1,
          comment: `Review for Course ${course.id}`,
          courseId: course.id,
          userId: users[i].id,
        },
      })
    )
  );
  console.log(`✅ Created ${reviews.length} reviews`);

  // COURSE PROGRESS (10 entries)
  const courseProgresses = await Promise.all(
    courses.map((course, i) =>
      prisma.courseProgress.create({
        data: {
          id: `course_progress_${i + 1}`,
          userId: users[i].id,
          courseId: course.id,
          isCompleted: i % 2 === 0,
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${courseProgresses.length} course progresses`);

  // ENROLLMENTS (10 entries)
  const enrollments = await Promise.all(
    courses.map((course, i) =>
      prisma.enrollment.create({
        data: {
          id: `enrollment_${i + 1}`,
          userId: users[i].id,
          courseId: course.id,
        },
      })
    )
  );
  console.log(`✅ Created ${enrollments.length} enrollments`);

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    (typeof globalThis.process !== "undefined" ? globalThis.process : { exit: () => {} }).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });