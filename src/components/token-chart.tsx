import { TokenHolding } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

export function TokenChart({ holdings }: { holdings: TokenHolding[] }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  const data = holdings
    .sort((a, b) => b.usdValue - a.usdValue)
    .slice(0, 5)
    .map((holding) => ({
      name: holding.marketData.baseToken.symbol,
      value: holding.usdValue
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
} 