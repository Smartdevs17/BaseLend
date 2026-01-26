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
  CreditCard
} from "lucide-react";
import { Web3Provider, useWeb3 } from "./context/Web3Context";

const DashboardShell = () => {
  const { account, connectWallet } = useWeb3();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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
          <div>
            <h2 className="text-3xl font-bold font-display">Lending Overview</h2>
            <p className="text-slate-400">Manage your positions and monitor protocol health.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-panel px-4 py-2 flex items-center gap-3 border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Mainnet</span>
            </div>

            <button
              onClick={connectWallet}
              className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Wallet size={18} />
              {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
            </button>
          </div>
        </header>

        {/* Content Area - To be implemented */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Placeholder for future components */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-20 flex items-center justify-center border-dashed border-slate-800">
              <p className="text-slate-500 font-medium">Dashboard components loading...</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-panel p-20 flex items-center justify-center border-dashed border-slate-800">
              <p className="text-slate-500 font-medium">Protocol stats loading...</p>
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
