import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

export function StatsView() {
  const data = [
    { name: '입금 완료', value: 12 },
    { name: '미입금', value: 3 },
  ];
  
  const COLORS = ['#f97316', '#e5e7eb']; // Orange-500, Gray-200

  return (
    <div className="space-y-6 pb-20">
      <Card className="border-stone-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">이번 달 회비 납부 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-stone-500">총 15명 중 <span className="font-bold text-orange-500">12명</span> 납부 완료</p>
            <p className="text-xs text-stone-400 mt-1">납부율 80%</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold text-stone-800 px-1">미납 멤버 (3명)</h3>
        <div className="bg-white rounded-xl border border-stone-100 p-4 space-y-3">
          {['박지성', '이영표', '손흥민'].map((name, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs text-stone-500">
                  {name[0]}
                </div>
                <span className="text-stone-900">{name}</span>
              </div>
              <button className="text-xs text-orange-500 font-medium px-3 py-1 bg-orange-50 rounded-full hover:bg-orange-100">
                독촉하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
