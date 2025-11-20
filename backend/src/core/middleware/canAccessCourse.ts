export async function canAccessCourse(prisma: any, userId: string, courseId: string): Promise<boolean> {
  // 1) Active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      currentPeriodEnd: { gt: new Date() },
    },
    include: {
      plan: {
        include: {
          courses: { where: { courseId } }, // explicit mapping
        },
      },
    },
  });

  if (subscription) {
    const { plan } = subscription;
    // all courses
    if (plan.hasAllCourses) return true;

    // explicit mapping
    if (plan.courses?.length > 0) return true;

    // optional tier guard
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (plan.tier != null && course?.tier != null && plan.tier >= course.tier) return true;
  }

  // 2) Purchased enrollment (or created on first access)
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) return false;

  // If enrollment is subscription-sourced and expired, deny
  if (enrollment.source === 'subscription' && enrollment.expiresAt && enrollment.expiresAt <= new Date()) {
    return false;
  }

  return true;
}