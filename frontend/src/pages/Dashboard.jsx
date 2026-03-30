import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { useAuthStore } from "../store/auth.store";
import { Activity, CreditCard, Bell, TrendingUp, Trash2 } from "lucide-react";
import { subscriptionAPI } from "../api/subscription.api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const rawName = user?.name || user?.data?.name || "User";
  const firstName = rawName.split(" ")[0];

  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary"],
    queryFn: () => subscriptionAPI.getSummary().then((res) => res.data.data),
  });

  const { data: subsRes, isLoading: subsLoading } = useQuery({
    queryKey: ["recentSubs"],
    queryFn: () =>
      subscriptionAPI
        .getAll({ sort: "nextRenewal", order: "asc", limit: 10 })
        .then((res) => res.data.subscriptions),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => subscriptionAPI.delete(id),
    onSuccess: () => {
      toast.success("Subscription deleted");
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["recentSubs"] });
    },
    onError: () => toast.error("Failed to delete subscription"),
  });

  const summary = summaryRes || [];
  const recentSubs = subsRes || [];

  const totalSubs = summary.reduce(
    (acc, curr) => acc + curr.totalSubscriptions,
    0,
  );
  const totalMonthly = summary.reduce(
    (acc, curr) => acc + curr.monthlyEstimate,
    0,
  );
  const totalYearly = summary.reduce(
    (acc, curr) => acc + curr.yearlyEstimate,
    0,
  );

  const upcomingRenewalsCount = recentSubs.filter((sub) => {
    const days = differenceInDays(new Date(sub.nextRenewal), new Date());
    return days >= 0 && days <= 7;
  }).length;

  const chartData = summary.map((item) => ({
    name: item._id,
    spend: item.monthlyEstimate,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-400">Here's your subscription overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="flex flex-col border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Active Subscriptions
              </p>
              <h2 className="text-3xl font-bold text-white">
                {summaryLoading ? "-" : totalSubs}
              </h2>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="flex flex-col border-l-4 border-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Monthly Spend
              </p>
              <h2 className="text-3xl font-bold text-white">
                {summaryLoading ? "-" : `₹${totalMonthly.toFixed(2)}`}
              </h2>
            </div>
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <CreditCard size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="flex flex-col border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Yearly Estimate
              </p>
              <h2 className="text-3xl font-bold text-white">
                {summaryLoading ? "-" : `₹${totalYearly.toFixed(2)}`}
              </h2>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="flex flex-col border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Renewals (7 Days)
              </p>
              <h2 className="text-3xl font-bold text-white">
                {subsLoading ? "-" : upcomingRenewalsCount}
              </h2>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <Bell size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2 h-96 flex flex-col p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Spending by Category
          </h3>
          <div className="flex-1 w-full min-h-0">
            {summaryLoading ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Loading chart...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [
                      `₹${parseFloat(value).toFixed(2)}`,
                      "Monthly Spend",
                    ]}
                  />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No active subscriptions to analyze
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col p-6 h-96">
          <h3 className="text-lg font-bold text-white mb-6">
            Upcoming Renewals
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {subsLoading ? (
              <div className="text-center text-gray-500 mt-10">
                Loading entries...
              </div>
            ) : recentSubs.length > 0 ? (
              recentSubs.map((sub) => (
                <div
                  key={sub._id}
                  className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                >
                  <div>
                    <p className="text-white font-medium">{sub.name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {sub.billingCycle.replace("_", " ").toLowerCase()} •{" "}
                      {sub.currency === "INR"
                        ? "₹"
                        : sub.currency === "USD"
                          ? "$"
                          : sub.currency}
                      {sub.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <p className="text-sm font-medium text-orange-400">
                      {format(new Date(sub.nextRenewal), "MMM dd")}
                    </p>
                    <button
                      onClick={() => deleteMutation.mutate(sub._id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                No upcoming renewals found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
