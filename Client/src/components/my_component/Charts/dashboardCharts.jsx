import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const monthlyApplicationsData = [
  { month: "Jan", applications: 65 },
  { month: "Feb", applications: 59 },
  { month: "Mar", applications: 80 },
  { month: "Apr", applications: 81 },
  { month: "May", applications: 56 },
  { month: "Jun", applications: 55 },
  { month: "Jul", applications: 40 },
];

const hiringPipelineData = [
  { stage: "Applied", count: 450 },
  { stage: "Screening", count: 280 },
  { stage: "Interview", count: 164 },
  { stage: "Offer", count: 82 },
  { stage: "Hired", count: 41 },
];

function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Applications</CardTitle>
          <CardDescription>
            Number of job applications received per month
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer
            config={{
              applications: {
                label: "Applications",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyApplicationsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--color-applications)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
          <CardDescription>
            Current status of applicants in the hiring process
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer
            config={{
              count: {
                label: "Applicants",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringPipelineData}>
                <XAxis dataKey="stage" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardCharts;
