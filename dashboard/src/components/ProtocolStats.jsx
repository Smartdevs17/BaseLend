import React from "react";
import { TrendingUp, ShieldCheck, Database, Users } from "lucide-react";

const ProtocolStats = () => {
    const stats = [
        { label: "Total Value Locked", value: "$124.5M", trend: "+12.4%", icon: Database, color: "blue" },
        { label: "Active Borrows", value: "$52.1M", trend: "+5.2%", icon: TrendingUp, color: "emerald" },
        { label: "Safety Module", value: "$12.8M", trend: "0.0%", icon: ShieldCheck, color: "indigo" },
        { label: "Total Users", value: "8,421", trend: "+124", icon: Users, color: "rose" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 pb-10 border-b border-slate-900">
            {stats.map((stat, i) => (
                <div key={i} className="glass-panel p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                            <stat.icon size={24} />
                        </div>
                        {stat.trend.startsWith('+') && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                    </div>

                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-white">
                        <stat.icon size={100} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProtocolStats;
