import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

const UserPositions = ({ supplies = [], borrows = [] }) => {
    const hasPositions = supplies.length > 0 || borrows.length > 0;

    if (!hasPositions) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            {supplies.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold font-display flex items-center gap-2">
                        <ArrowUpRight className="text-emerald-500" size={18} /> Your Supplies
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {supplies.map((pos, i) => (
                            <div key={i} className="glass-panel p-4 flex justify-between items-center border-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-700">
                                        {pos.symbol[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{pos.asset}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pos.amount} {pos.symbol}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-emerald-400">{pos.apy}% APY</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">EARNING</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {borrows.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold font-display flex items-center gap-2">
                        <ArrowDownLeft className="text-rose-500" size={18} /> Your Borrows
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {borrows.map((pos, i) => (
                            <div key={i} className="glass-panel p-4 flex justify-between items-center border-rose-500/10 hover:border-rose-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-700">
                                        {pos.symbol[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{pos.asset}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pos.amount} {pos.symbol}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-rose-400">{pos.apy}% APY</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">DEBT</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPositions;
