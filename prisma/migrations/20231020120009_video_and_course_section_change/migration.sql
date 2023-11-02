-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "refreshTokenGenerationTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "refreshToken" TEXT,
    "refreshTokenExpiry" TEXT,
    "refreshTokenStatus" TEXT,
    "accessTokenGenerationTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT,
    "accessTokenExpiry" TEXT,
    "accessTokenStatus" TEXT,
    "resetTokenGenerationTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "resetToken" TEXT,
    "resetTokenExpiry" TEXT,
    "resetTokenStatus" TEXT,
    "isInstructor" BOOLEAN,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishList" (
    "userId" TEXT NOT NULL,
    "wishListedItems" TEXT[],

    CONSTRAINT "wishList_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "cart" (
    "userId" TEXT NOT NULL,
    "cartItems" TEXT[],

    CONSTRAINT "cart_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "instructor" (
    "instructorID" TEXT NOT NULL,
    "instructorName" TEXT NOT NULL,
    "instructorEmail" TEXT NOT NULL,
    "instructorTag" TEXT NOT NULL,
    "instructorProfilePicUrl" TEXT NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("instructorID")
);

-- CreateTable
CREATE TABLE "category" (
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("categoryName")
);

-- CreateTable
CREATE TABLE "enrolledCourses" (
    "uid" TEXT NOT NULL,
    "enrolledCourses" TEXT[],

    CONSTRAINT "enrolledCourses_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "course" (
    "courseId" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "courseImage" TEXT NOT NULL,
    "courseCreator" TEXT NOT NULL,
    "courseDescription" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "coursePrice" TEXT NOT NULL,
    "dealPrice" TEXT,
    "discount" TEXT,
    "courseSectionsIds" TEXT[],
    "courseProgress" TEXT,
    "instructorID" TEXT,
    "totalEnrolledStudents" BIGINT,
    "isLive" BOOLEAN DEFAULT false,

    CONSTRAINT "course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "enrolledStudents" (
    "courseId" TEXT NOT NULL,
    "enrolledStudents" TEXT[],

    CONSTRAINT "enrolledStudents_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "courseSection" (
    "courseSectionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "courseSectionNumber" INTEGER NOT NULL,
    "courseSectionTitle" TEXT NOT NULL,
    "courseSectionDescription" TEXT,

    CONSTRAINT "courseSection_pkey" PRIMARY KEY ("courseSectionId")
);

-- CreateTable
CREATE TABLE "video" (
    "videoId" TEXT NOT NULL,
    "courseSectionId" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoDuration" TEXT,
    "videoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "videoResources" (
    "videoId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourcesUrl" TEXT[],
    "durationString" TEXT NOT NULL,

    CONSTRAINT "videoResources_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "videoNotes" (
    "videoId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "noteText" TEXT,
    "noteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videoNotes_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "enrollement" (
    "enrollmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionStatus" TEXT NOT NULL,

    CONSTRAINT "enrollement_pkey" PRIMARY KEY ("enrollmentId")
);

-- CreateTable
CREATE TABLE "payment" (
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transactionId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionAmount" TEXT NOT NULL,
    "transactionStatus" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "instructorEarningModel" (
    "earningId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "earningDate" TEXT NOT NULL,
    "earningAmount" TEXT NOT NULL,

    CONSTRAINT "instructorEarningModel_pkey" PRIMARY KEY ("earningId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolledCourses" ADD CONSTRAINT "enrolledCourses_uid_fkey" FOREIGN KEY ("uid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructorID_fkey" FOREIGN KEY ("instructorID") REFERENCES "instructor"("instructorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolledStudents" ADD CONSTRAINT "enrolledStudents_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseSection" ADD CONSTRAINT "courseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_courseSectionId_fkey" FOREIGN KEY ("courseSectionId") REFERENCES "courseSection"("courseSectionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoResources" ADD CONSTRAINT "videoResources_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoNotes" ADD CONSTRAINT "videoNotes_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoNotes" ADD CONSTRAINT "videoNotes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollement" ADD CONSTRAINT "enrollement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollement" ADD CONSTRAINT "enrollement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("paymentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructorEarningModel" ADD CONSTRAINT "instructorEarningModel_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructorEarningModel" ADD CONSTRAINT "instructorEarningModel_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
