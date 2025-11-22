import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import moment from "moment";
import { SPEND_INFO } from "../../assets";

export interface ChartData {
  month: string;
  value: number;
}

interface SpendingData {
  title: string;
  count: number;
  chart_data: ChartData[];
  growth: number;
}

// ✅ FIXED Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // ✅ actual data lives here
    const date = data.month;
    const value = `${data.value}`;

    return (
      <div className="bg-white shadow-md rounded-lg border border-gray-200 px-4 py-2">
        <p className="text-xs text-gray-500 font-medium">{date}</p>
        <p className="text-base font-semibold text-gray-800">{value}</p>
      </div>
    );
  }
  return null;
};

export const PercentageChange = ({
  percentage,
}: {
  percentage: number | undefined;
}) => {
  // const percentage = data?.percentage_change ?? 0;
  const isPositive = percentage && percentage >= 0;

  const bgColor = isPositive ? "bg-[#05B47F1A]" : "bg-amber-100";
  const textColor = isPositive ? "text-[#05B47F]" : "text-amber-600";
  const ArrowIcon = () =>
    isPositive ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    );

  return (
    <div
      className={`w-fit h-fit px-2 py-1 gap-x-1 rounded-3xl flex items-center justify-end ${bgColor}`}
    >
      <span className={`${textColor}`}>
        <ArrowIcon />
      </span>
      <span className={`text-xs font-medium ${textColor}`}>{percentage}%</span>
    </div>
  );
};

export default function SpendingChart({
  title,
  chart_data,
  count,
  growth,
}: SpendingData) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border w-full border-gray-100 mt-5">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-gray-700 text-xl font-medium flex items-center gap-1">
            {title}
            <img src={SPEND_INFO} className="w-[20px] h-[20px]" alt="" />
          </span>
          <h1 className="text-3xl font-bold mt-4">{count || 0}</h1>

          <div className="flex items-center gap-x-2 mt-1">
            {/* <div className="w-fit h-fit p-1 gap-x-0.5 rounded-3xl bg-[#05B47F1A] flex items-center justify-end">
              <img src={GOING_UP} className="w-[16px] h-[16px]" alt="" />
              <span className="text-xs font-medium text-[#05B47F]">
                {data?.percentage_change ?? 0}%
              </span>
            </div> */}
            <PercentageChange percentage={growth} />
            <span className="text-[16px] text-primary-50 font-medium">
              vs last month
            </span>
          </div>
        </div>

        {/* <button className="flex items-center text-[#808080] px-3 py-3 rounded-xl transition-all hover:scale-95 duration-300 border border-borderColor gap-x-2">
          <img src={CALENDER_ICON} className="w-[20px] h-[20px]" alt="" />
          <span className="text-sm font-normal">Filter period</span>
          <img src={CHEVRON_DOWN_GRAY} className="w-[20px] h-[20px]" alt="" />
        </button> */}
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chart_data ?? []}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD600" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FFD600" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              tickFormatter={(date) => moment(date).format("MMM")}
              tick={{ fontSize: 12, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFD600"
              strokeWidth={2.5}
              fill="url(#colorYellow)"
              activeDot={{ r: 6, fill: "#FFD600" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
