import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { subscriptionAPI } from "../api/subscription.api";
import { Trash2, AlertCircle, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/Button";

const Subscriptions = () => {
  const queryClient = useQueryClient();

  const {
    data: subs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () =>
      subscriptionAPI.getAll().then((res) => res.data.subscriptions),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => subscriptionAPI.delete(id),
    onSuccess: () => {
      toast.success("Subscription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["recentSubs"] });
    },
    onError: () => toast.error("Failed to delete subscription"),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">
            Subscriptions
          </h1>
          <p className="text-gray-400">
            Manage all your active subscriptions here.
          </p>
        </div>
        <Link
          to="/subscriptions/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
        >
          + Add New
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <Card className="flex flex-col items-center justify-center h-64 text-center border-red-500/20 bg-red-500/5">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-400 font-medium">
            Failed to load subscriptions.
          </p>
          <Button
            variant="ghost"
            onClick={() => queryClient.invalidateQueries(["subscriptions"])}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      ) : subs && subs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subs.map((sub) => (
            <Card key={sub._id} hover className="flex flex-col relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold text-white truncate pr-4"
                    title={sub.name}
                  >
                    {sub.name}
                  </h3>
                  <p className="text-sm text-gray-400 capitalize bg-white/5 inline-block px-2 py-1 rounded mt-2 border border-white/10">
                    {sub.category || "General"}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-lg font-bold text-primary">
                    {sub.currency === "INR"
                      ? "₹"
                      : sub.currency === "USD"
                        ? "$"
                        : sub.currency}
                    {sub.amount}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mt-auto pt-4 border-t border-glassBorder/50">
                <div className="flex items-center text-sm text-gray-300">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="capitalize">
                    {sub.billingCycle.replace("_", " ").toLowerCase()} Billing
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    Renews {format(new Date(sub.nextRenewal), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-glass backdrop-blur bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <Button
                  variant="danger"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => deleteMutation.mutate(sub._id)}
                  isLoading={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No Subscriptions Yet
          </h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            You haven't added any subscriptions to track yet. Add your first one
            to get started!
          </p>
          <Link to="/subscriptions/new">
            <Button variant="primary">Add Subscription</Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default Subscriptions;
