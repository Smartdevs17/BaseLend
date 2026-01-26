import React, { useState } from "react";
import { X, ArrowUpRight, ShieldCheck, Info, Loader2 } from "lucide-react";

const SupplyModal = ({ asset, symbol, supplyApy, isOpen, onClose }) => {
    const [amount, setAmount] = useState("");
    const [isSupplying, setIsSupplying] = useState(false);

    if (!isOpen) return null;

    const handleSupply = async (e) => {
        e.preventDefault();
        if (!amount) return;

        setIsSupplying(true);
        // Simulate transaction
        setTimeout(() => {
            alert(`Successfully supplied ${amount} ${symbol} to the pool.`);
            setIsSupplying(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display">Supply {asset}</h3>
                        <p className="text-sm text-slate-500">Provide liquidity to earn {supplyApy}% APY.</p>
                    </div>
                </div>

                <form onSubmit={handleSupply} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount to Supply</label>
                            <span className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer uppercase tracking-widest">Available: 0.00</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl py-4 pl-4 pr-16 text-white font-black text-xl focus:outline-none focus:border-blue-500 transition-all"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                                {symbol}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Transaction Overview</span>
                            <span className="text-blue-400 font-bold">Details</span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500 uppercase font-bold">Supply APY</span>
                                <span className="text-emerald-400 font-black">{supplyApy}%</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500 uppercase font-bold">Collateral Status</span>
                                <span className="text-blue-400 font-black flex items-center gap-1"><ShieldCheck size={12} /> Enabled</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSupplying || !amount}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {isSupplying ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing Transaction...
                            </>
                        ) : (
                            `Supply ${symbol}`
                        )}
                    </button>

                    <p className="text-[10px] text-slate-600 text-center uppercase font-bold tracking-widest flex items-center justify-center gap-1">
                        <Info size={10} /> Approval needed for first-time supply
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SupplyModal;
