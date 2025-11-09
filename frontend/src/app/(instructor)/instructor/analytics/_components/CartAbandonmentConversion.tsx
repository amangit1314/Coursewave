"use client";

import React from "react";
import {
  ShoppingCart,
  Eye,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, AreaChart } from "@tremor/react";
import { BsCircleFill } from "react-icons/bs";

interface FunnelStage {
  stage: string;
  count: number;
  dropoffRate: number;
}

interface CartAbandonmentReason {
  reason: string;
  count: number;
  percentage: number;
}

interface TimeToConversion {
  timeRange: string;
  conversions: number;
}

interface CartAbandonmentFunnelProps {
  totalViews: number;
  cartAdditions: number;
  checkoutInitiated: number;
  purchasesCompleted: number;
  abandonmentRate: number;
  averageCartValue: number;
  potentialRevenueLost: number;
  abandonmentReasons: CartAbandonmentReason[];
  timeToConversion: TimeToConversion[];
  conversionTrend: number;
}

export const CartAbandonmentFunnel: React.FC<CartAbandonmentFunnelProps> = ({
  totalViews,
  cartAdditions,
  checkoutInitiated,
  purchasesCompleted,
  abandonmentRate,
  averageCartValue,
  potentialRevenueLost,
  abandonmentReasons,
  timeToConversion,
  conversionTrend,
}) => {
  // Calculate conversion rates at each stage
  const cartConversionRate = ((cartAdditions / totalViews) * 100).toFixed(1);
  const checkoutConversionRate = (
    (checkoutInitiated / cartAdditions) *
    100
  ).toFixed(1);
  const purchaseConversionRate = (
    (purchasesCompleted / checkoutInitiated) *
    100
  ).toFixed(1);
  const overallConversionRate = (
    (purchasesCompleted / totalViews) *
    100
  ).toFixed(1);

  // Funnel data
  const funnelData = [
    { stage: "Course Views", count: totalViews, rate: 100 },
    {
      stage: "Added to Cart",
      count: cartAdditions,
      rate: Number(cartConversionRate),
    },
    {
      stage: "Checkout Started",
      count: checkoutInitiated,
      rate: Number(checkoutConversionRate),
    },
    {
      stage: "Purchase Completed",
      count: purchasesCompleted,
      rate: Number(purchaseConversionRate),
    },
  ];

  // Calculate dropoff at each stage
  const dropoffData = [
    {
      stage: "View → Cart",
      lost: totalViews - cartAdditions,
      rate: (100 - Number(cartConversionRate)).toFixed(1),
    },
    {
      stage: "Cart → Checkout",
      lost: cartAdditions - checkoutInitiated,
      rate: (100 - Number(checkoutConversionRate)).toFixed(1),
    },
    {
      stage: "Checkout → Purchase",
      lost: checkoutInitiated - purchasesCompleted,
      rate: (100 - Number(purchaseConversionRate)).toFixed(1),
    },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6  mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cart Abandonment Rate */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              Critical
            </Badge>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {abandonmentRate.toFixed(1)}%
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Abandonment rate
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            {conversionTrend !== 0 && (
              <Badge
                className={
                  conversionTrend > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                {conversionTrend > 0 ? "+" : ""}
                {conversionTrend}%
              </Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {overallConversionRate}%
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Overall conversion
          </p>
        </div>

        {/* Avg Cart Value */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${averageCartValue.toFixed(2)}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Avg cart value
          </p>
        </div>

        {/* Revenue Lost */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${potentialRevenueLost.toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Potential lost
          </p>
        </div>
      </div>

      {/* Conversion Funnel Visualization */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Conversion Funnel
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track user journey from view to purchase
          </p>
        </div>

        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const percentage = (stage.count / totalViews) * 100;
            const dropoff =
              index > 0 ? funnelData[index - 1].count - stage.count : 0;

            return (
              <div key={stage.stage} className="relative">
                {/* Funnel Stage */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : index === 1
                                ? "bg-purple-100 dark:bg-purple-900/30"
                                : index === 2
                                  ? "bg-orange-100 dark:bg-orange-900/30"
                                  : "bg-green-100 dark:bg-green-900/30"
                          }`}
                        >
                          {index === 0 ? (
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : index === 1 ? (
                            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          ) : index === 2 ? (
                            <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {stage.stage}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {stage.count.toLocaleString()} users (
                            {percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      {index > 0 && dropoff > 0 && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          -{dropoff.toLocaleString()} dropped
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <div className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-xl transition-all duration-500 ${
                            index === 0
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : index === 1
                                ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                : index === 2
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Abandonment Reasons & Time to Conversion */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Abandonment Reasons */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Why Users Abandon Carts
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Top reasons for cart abandonment
            </p>
          </div>
          <div className="space-y-3">
            {abandonmentReasons.map((reason, index) => (
              <div
                key={reason.reason}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-600 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {reason.reason}
                    </span>
                  </div>
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {reason.percentage}%
                  </Badge>
                </div>
                <Progress value={reason.percentage} className="h-2" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  {reason.count} abandonment cases
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Conversion */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Time to Conversion
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              How long users take to purchase
            </p>
          </div>
          <BarChart
            className="h-80"
            data={timeToConversion}
            index="timeRange"
            categories={["conversions"]}
            colors={["green"]}
            valueFormatter={(value) => value.toLocaleString()}
            showAnimation={true}
            showLegend={false}
            showGridLines={true}
            yAxisWidth={60}
            customTooltip={({ payload, label }) =>
              payload && payload.length > 0 ? (
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                  <div className="font-semibold mb-1">{label}</div>
                  <div className="space-y-1">
                    {payload.map((item) => (
                      <div
                        key={item.dataKey}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <BsCircleFill
                            className="w-3 h-3"
                            style={{ color: item.color }}
                          />
                          {item.name}
                        </span>
                        <span>
                          {item.value?.toLocaleString?.() ?? item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            }
          />
        </div>
      </div>

      {/* Dropoff Analysis */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Dropoff Analysis
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Users lost at each funnel stage
          </p>
        </div>
        <BarChart
          className="h-64"
          data={dropoffData}
          index="stage"
          categories={["lost"]}
          colors={["red"]}
          valueFormatter={(value) => value.toLocaleString()}
          showAnimation={true}
          showLegend={false}
          layout="horizontal"
          yAxisWidth={140}
          customTooltip={({ payload, label }) =>
            payload && payload.length > 0 ? (
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-zinc-900 dark:text-white min-w-[200px]">
                <div className="font-semibold mb-1">{label}</div>
                <div className="space-y-1">
                  {payload.map((item) => (
                    <div
                      key={item.dataKey}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <BsCircleFill
                          className="w-3 h-3"
                          style={{ color: item.color }}
                        />
                        {item.name}
                      </span>
                      <span>
                        {item.value?.toLocaleString?.() ?? item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          }
        />
      </div>

      {/* Action Recommendations */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Recommendations to Reduce Abandonment
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-zinc-900 dark:text-white mb-2">
              1. Simplify Checkout
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Reduce form fields and offer guest checkout to minimize friction
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-zinc-900 dark:text-white mb-2">
              2. Add Trust Signals
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Display security badges and money-back guarantees prominently
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-zinc-900 dark:text-white mb-2">
              3. Email Recovery
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Send automated reminder emails to users who abandoned carts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
