"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, BookOpen } from "lucide-react";
import { useMyInstructorEarnings } from "@/hooks/useInstructor";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PageContainer,
  PageHeader,
  StatCard,
  EmptyState,
  LoadingPage,
  UnauthorizedState,
  StatusBadge,
  resolveStatusType,
} from "@/components/shared";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/config/motion";
import type { EarningTransaction } from "@/types/instructor.service.types";

export default function EarningsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  const { data, isLoading, error } = useMyInstructorEarnings();

  React.useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? `Failed to load earnings: ${error.message}`
          : "Failed to load earnings"
      );
    }
  }, [error]);

  if (!isInstructor) {
    return (
      <UnauthorizedState
        description="You need to be an instructor to view earnings."
        action={{
          label: "Become an Instructor",
          onClick: () => router.push(`/profile/${user?.id}`),
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage variant="stats" />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState
          icon={DollarSign}
          title="No Earnings Yet"
          description="Start creating and publishing courses to earn revenue."
          action={{
            label: "Create a Course",
            onClick: () => router.push("/instructor/courses/create"),
          }}
        />
      </PageContainer>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data.currency,
    }).format(amount / 100);

  return (
    <PageContainer>
      <PageHeader title="Earnings & Payouts" />

      {/* Summary Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          label="Total Earnings"
          value={formatCurrency(data.totalEarnings)}
          icon={DollarSign}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Total Transactions"
          value={data.transactions.length}
          icon={TrendingUp}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Courses Earning"
          value={data.earningsByCourse.length}
          icon={BookOpen}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-900/20"
        />
      </motion.div>

      {/* Earnings by Course */}
      {data.earningsByCourse.length > 0 && (
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Earnings by Course
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.earningsByCourse.map((ec) => (
                  <motion.tr
                    key={ec.courseId}
                    {...hoverLift}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">
                      {ec.courseTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right tabular-nums">
                      {ec.count}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right tabular-nums">
                      {formatCurrency(ec.total)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Transactions
        </h2>
        {data.transactions.length === 0 ? (
          <EmptyState
            title="No Transactions"
            description="No transactions yet."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.transactions.map((tx: EarningTransaction) => (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {tx.course.title}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={resolveStatusType(tx.status)}
                        label={tx.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right tabular-nums">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}
