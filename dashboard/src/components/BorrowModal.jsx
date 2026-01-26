import React, { useState } from "react";
import { X, ArrowDownLeft, AlertTriangle, Info, Loader2 } from "lucide-react";

const BorrowModal = ({ asset, symbol, borrowApy, isOpen, onClose, liquidity }) => {
    const [amount, setAmount] = useState("");
    const [isBorrowing, setIsBorrowing] = useState(false);

    if (!isOpen) return null;

    const handleBorrow = async (e) => {
        e.preventDefault();
        if (!amount) return;

        setIsBorrowing(true);
        // Simulate transaction
        setTimeout(() => {
            alert(`Successfully borrowed ${amount} ${symbol}.`);
            setIsBorrowing(false);
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
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white">
                        <ArrowDownLeft size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display">Borrow {asset}</h3>
                        <p className="text-sm text-slate-500">Variable APY: {borrowApy}%</p>
                    </div>
                </div>

                <form onSubmit={handleBorrow} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount to Borrow</label>
                            <span className="text-[10px] font-bold text-rose-500 cursor-pointer uppercase tracking-widest">Available: {liquidity}</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl py-4 pl-4 pr-16 text-white font-black text-xl focus:outline-none focus:border-rose-500 transition-all"
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
                            <span className="text-slate-400">Borrow Limit Impact</span>
                            <span className="text-rose-400 font-bold">Risk Level</span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500 uppercase font-bold">Total Debt</span>
                                <span className="text-white font-black">$0.00 → ${amount || '0.00'}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-600">
                                    <span>Limit Used</span>
                                    <span>0%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isBorrowing || !amount}
                        className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                    >
                        {isBorrowing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Confirming Loan...
                            </>
                        ) : (
                            `Borrow ${symbol}`
                        )}
                    </button>

                    <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-2 items-start">
                        <AlertTriangle className="text-rose-500 shrink-0" size={14} />
                        <p className="text-[10px] text-rose-500/80 leading-relaxed">
                            Borrowing increases your liquidation risk. Ensure your Health Factor remains above 1.0.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BorrowModal;
