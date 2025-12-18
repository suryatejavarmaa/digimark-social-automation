import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', engagement: 320 },
  { day: 'Tue', engagement: 450 },
  { day: 'Wed', engagement: 380 },
  { day: 'Thu', engagement: 520 },
  { day: 'Fri', engagement: 610 },
  { day: 'Sat', engagement: 580 },
  { day: 'Sun', engagement: 690 },
];

export function AnalyticsChart() {
  return (
    <div className="w-full" style={{ height: '192px' }}>
      <ResponsiveContainer width="100%" height={192}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="day"
            stroke="rgba(255, 255, 255, 0.4)"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.4)"
            style={{ fontSize: '0.75rem' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(45, 45, 45, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Line
            type="monotone"
            dataKey="engagement"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10b981' }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
