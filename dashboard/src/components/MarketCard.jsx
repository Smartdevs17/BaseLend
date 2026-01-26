import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Info } from "lucide-react";
import SupplyModal from "./SupplyModal";

const MarketCard = (props) => {
    const { asset, symbol, supplyApy, borrowApy, liquidity, logo } = props;
    const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

    return (
        <>
            <div className="glass-panel p-6 border-slate-800 hover:border-slate-700 transition-all group">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl font-black text-white border border-slate-700">
                            {logo || symbol[0]}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{asset}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{symbol}</p>
                        </div>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors">
                        <Info size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Supply APY</p>
                        <p className="text-lg font-black text-emerald-400">{supplyApy}%</p>
                    </div>
                    <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Borrow APY</p>
                        <p className="text-lg font-black text-rose-400">{borrowApy}%</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Liquidity</span>
                    <span className="text-xs font-bold text-white">{liquidity}</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsSupplyModalOpen(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowUpRight size={16} /> Supply
                    </button>
                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                        <ArrowDownLeft size={16} /> Borrow
                    </button>
                </div>
            </div>

            <SupplyModal
                isOpen={isSupplyModalOpen}
                onClose={() => setIsSupplyModalOpen(false)}
                {...props}
            />
        </>
    );
};

export default MarketCard;
