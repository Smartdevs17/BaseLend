import React from "react";
import {
  Building2,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
  PieChart,
  ShieldAlert,
  Menu,
  X,
  CreditCard,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Web3Provider, useWeb3 } from "./context/Web3Context";
import ProtocolStats from "./components/ProtocolStats";
import MarketCard from "./components/MarketCard";
import UserPositions from "./components/UserPositions";

const DashboardShell = () => {
  const { account, connectWallet } = useWeb3();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const markets = [
    { asset: "Ethereum", symbol: "ETH", supplyApy: "3.24", borrowApy: "5.12", liquidity: "$42.5M", logo: "Ξ" },
    { asset: "USD Base Coin", symbol: "USDC", supplyApy: "5.82", borrowApy: "7.45", liquidity: "$85.2M", logo: "$" },
    { asset: "Wrapped Bitcoin", symbol: "WBTC", supplyApy: "1.25", borrowApy: "2.84", liquidity: "$15.8M", logo: "₿" },
  ];

  // Mock data for positions
  const userPositions = account ? {
    supplies: [
      { asset: "Ethereum", symbol: "ETH", amount: "12.4", apy: "3.24" },
      { asset: "USD Base Coin", symbol: "USDC", amount: "5,200", apy: "5.82" },
    ],
    borrows: [
      { asset: "Wrapped Bitcoin", symbol: "WBTC", amount: "0.05", apy: "2.84" },
    ]
  } : { supplies: [], borrows: [] };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`glass-panel fixed h-[calc(100vh-32px)] m-4 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="text-white" size={24} />
            </div>
            <h1 className={`font-display font-black text-xl tracking-tighter ${!isSidebarOpen && 'opacity-0'}`}>BaseLend</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: TrendingUp, label: "Markets", active: false },
              { icon: PieChart, label: "Portfolio", active: false },
              { icon: ShieldAlert, label: "Liquidations", active: false },
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                <item.icon size={20} className="shrink-0" />
                <span className={`font-medium ${!isSidebarOpen && 'opacity-0'} transition-opacity whitespace-nowrap`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button className="flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:text-white w-full transition-all">
              <span className="shrink-0">⚙️</span>
              <span className={`font-medium ${!isSidebarOpen && 'opacity-0'} transition-opacity`}>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[288px]' : 'ml-[112px]'} p-8`}>
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-3xl font-bold font-display">Lending Overview</h2>
              <p className="text-slate-400">Manage your positions and monitor protocol health.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-panel px-4 py-2 flex items-center gap-3 border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Mainnet</span>
            </div>

            <button
              onClick={connectWallet}
              className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Wallet size={18} />
              {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
            </button>
          </div>
        </header>

        <ProtocolStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={20} /> Markets Overview
              </h3>
              <button className="text-xs font-bold text-blue-500 hover:underline tracking-widest uppercase">View All Markets</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {markets.map((market, i) => (
                <MarketCard key={i} {...market} />
              ))}
              <div className="glass-panel p-6 border-dashed border-slate-800 flex flex-col items-center justify-center text-center opacity-60">
                <div className="p-3 rounded-full bg-slate-800 text-slate-500 mb-3">
                  <Zap size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">More Assets Coming</p>
                <p className="text-[10px] text-slate-600 uppercase font-black">Community Vote Active</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold font-display flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} /> Your Positions
            </h3>

            {account ? (
              <UserPositions {...userPositions} />
            ) : (
              <div className="glass-panel p-8 bg-gradient-to-br from-slate-900/50 to-blue-900/10 border-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Account Health</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black">---</span>
                    <span className="text-slate-500 font-bold uppercase text-xs">Factor</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-[200px]">Connect your wallet to see your supply and borrow positions.</p>
                  <button
                    onClick={connectWallet}
                    className="mt-6 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all capitalize"
                  >
                    Analyze Portfolio
                  </button>
                </div>
                <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            )}

            <div className="glass-panel p-6 border-slate-800">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Risk Monitor</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Borrow Limit</span>
                  <span className="text-white font-bold">{account ? "$12,400" : "$0.00"}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: account ? '42%' : '0%' }}></div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Liquidation Risk</span>
                  <span className={`px-2 py-0.5 rounded ${account ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'} text-[10px] font-black uppercase`}>
                    {account ? 'Moderate' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Web3Provider>
      <DashboardShell />
    </Web3Provider>
  );
};

export default App;
