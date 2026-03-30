import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { subscriptionAPI } from "../api/subscription.api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(150, "Name is too long"),
  description: z
    .string()
    .min(2, "Description is required")
    .max(500, "Description is too long"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().max(10, "Currency code max 10 chars").default("INR"),
  billingCycle: z
    .enum(["WEEKLY", "MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"])
    .default("MONTHLY"),
  category: z.string().max(50, "Category max 50 chars"),
  startDate: z.string().min(1, "Start date is required"),
  remainderDays: z
    .number()
    .min(1, "Min 1 day")
    .max(30, "Max 30 days")
    .default(7),
  notifyEmail: z.boolean().default(true),
});

export default function CreateSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: "INR",
      billingCycle: "MONTHLY",
      startDate: new Date().toISOString().split("T")[0],
      remainderDays: 7,
      notifyEmail: true,
      category: "ENTERTAINMENT",
      description: "Monthly service plan",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await subscriptionAPI.create(data);
      toast.success("Subscription created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create subscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white">
          Add Subscription
        </h1>
        <p className="text-gray-400">Track a new recurring expense.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Subscription Name"
              placeholder="e.g. Netflix, Spotify"
              error={errors.name}
              {...register("name")}
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Category
              </label>
              <select
                className="w-full bg-glass border border-glassBorder focus:ring-primary focus:border-primary rounded-lg px-4 py-2.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none"
                {...register("category")}
              >
                <option
                  className="bg-gray-800 text-white"
                  value="ENTERTAINMENT"
                >
                  Entertainment
                </option>
                <option className="bg-gray-800 text-white" value="SOFTWARE">
                  Software & Tools
                </option>
                <option className="bg-gray-800 text-white" value="UTILITIES">
                  Utilities & Bills
                </option>
                <option className="bg-gray-800 text-white" value="FOOD">
                  Food & Delivery
                </option>
                <option className="bg-gray-800 text-white" value="HEALTH">
                  Health & Fitness
                </option>
                <option className="bg-gray-800 text-white" value="EDUCATION">
                  Education
                </option>
                <option className="bg-gray-800 text-white" value="OTHER">
                  Other
                </option>
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount}
              {...register("amount", { valueAsNumber: true })}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Currency
              </label>
              <select
                className="w-full bg-glass border border-glassBorder focus:ring-primary focus:border-primary rounded-lg px-4 py-2.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none"
                {...register("currency")}
              >
                <option className="bg-gray-800 text-white" value="INR">
                  INR (₹)
                </option>
                <option className="bg-gray-800 text-white" value="USD">
                  USD ($)
                </option>
                <option className="bg-gray-800 text-white" value="EUR">
                  EUR (€)
                </option>
                <option className="bg-gray-800 text-white" value="GBP">
                  GBP (£)
                </option>
              </select>
              {errors.currency && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.currency.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Billing Cycle
              </label>
              <select
                className="w-full bg-glass border border-glassBorder focus:ring-primary focus:border-primary rounded-lg px-4 py-2.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none"
                {...register("billingCycle")}
              >
                <option className="bg-gray-800 text-white" value="WEEKLY">
                  Weekly
                </option>
                <option className="bg-gray-800 text-white" value="MONTHLY">
                  Monthly
                </option>
                <option className="bg-gray-800 text-white" value="QUARTERLY">
                  Quarterly
                </option>
                <option className="bg-gray-800 text-white" value="HALF_YEARLY">
                  Half Yearly
                </option>
                <option className="bg-gray-800 text-white" value="YEARLY">
                  Yearly
                </option>
              </select>
              {errors.billingCycle && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.billingCycle.message}
                </p>
              )}
            </div>

            <Input
              label="Start Date / Next Payment"
              type="date"
              error={errors.startDate}
              {...register("startDate")}
            />
          </div>

          <div className="w-full">
            <Input
              label="Description (Optional)"
              type="text"
              placeholder="Brief details about this subscription..."
              error={errors.description}
              {...register("description")}
            />
          </div>

          <div className="border-t border-gray-800 pt-6 mt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-background/30 p-4 rounded-xl border border-glassBorder">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notifyEmail"
                  className="w-5 h-5 rounded border-glassBorder bg-glass text-primary focus:ring-primary focus:ring-offset-background"
                  {...register("notifyEmail")}
                />
                <label htmlFor="notifyEmail" className="text-white font-medium">
                  Email Reminders
                </label>
              </div>

              <Input
                label="Remind me before (Days)"
                type="number"
                min="1"
                max="30"
                error={errors.remainderDays}
                {...register("remainderDays", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Subscription
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
