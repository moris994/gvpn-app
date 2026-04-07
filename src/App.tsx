import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Settings, 
  Activity, 
  Lock, 
  Unlock,
  ChevronRight,
  Signal,
  Clock,
  HardDrive,
  Cpu,
  Menu,
  X,
  RefreshCw,
  Split,
  Layers,
  Search,
  CheckCircle2,
  EyeOff,
  Home,
  Link,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';

// --- Types ---

type Server = {
  id: string;
  country: string;
  city: string;
  flag: string;
  latency: number;
  load: number;
  isResidential?: boolean;
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

type TunnelingMode = 'full' | 'split';

interface AppConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface StealthConfig {
  obfuscation: boolean;
  residentialIp: boolean;
  killSwitch: boolean;
  multiHop: boolean;
  netshield: {
    ads: boolean;
    trackers: boolean;
    malware: boolean;
  };
}

// --- Constants ---

const SERVERS: Server[] = [
  { id: 'us-east', country: 'United States', city: 'New York', flag: '🇺🇸', latency: 24, load: 45, isResidential: true },
  { id: 'uk-lon', country: 'United Kingdom', city: 'London', flag: '🇬🇧', latency: 82, load: 62, isResidential: true },
  { id: 'de-fra', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', latency: 95, load: 38 },
  { id: 'jp-tok', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', latency: 180, load: 75, isResidential: true },
  { id: 'sg-sin', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', latency: 210, load: 22 },
  { id: 'au-syd', country: 'Australia', city: 'Sydney', flag: '🇦🇺', latency: 240, load: 51 },
];

const DEFAULT_APPS: AppConfig[] = [
  { id: 'browser', name: 'Web Browser', icon: '🌐', enabled: true },
  { id: 'gaming', name: 'Steam / Gaming', icon: '🎮', enabled: false },
  { id: 'streaming', name: 'Netflix / Media', icon: '🎬', enabled: true },
  { id: 'work', name: 'Slack / Zoom', icon: '💼', enabled: true },
  { id: 'system', name: 'System Updates', icon: '⚙️', enabled: false },
];

// --- Components ---

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
      <p className="text-lg font-display font-bold text-white">{value}</p>
    </div>
  </div>
);

const Toggle = ({ enabled, onChange, label, icon: Icon }: { enabled: boolean, onChange: (v: boolean) => void, label: string, icon: any }) => (
  <button 
    onClick={() => onChange(!enabled)}
    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
      enabled ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-white/5 border-transparent hover:border-white/10'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-sm font-bold ${enabled ? 'text-white' : 'text-slate-400'}`}>{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}>
      <motion.div 
        animate={{ x: enabled ? 22 : 2 }}
        className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </div>
  </button>
);

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedServer, setSelectedServer] = useState<Server>(SERVERS[0]);
  const [uptime, setUptime] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'servers' | 'tunneling' | 'stealth'>('servers');
  const [tunnelMode, setTunnelMode] = useState<TunnelingMode>('full');
  const [apps, setApps] = useState<AppConfig[]>(DEFAULT_APPS);
  const [serverSearch, setServerSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [stealth, setStealth] = useState<StealthConfig>({
    obfuscation: true,
    residentialIp: true,
    killSwitch: true,
    multiHop: false,
    netshield: {
      ads: true,
      trackers: true,
      malware: true,
    },
  });
  const [blockedCount, setBlockedCount] = useState(0);
  const [liveLatency, setLiveLatency] = useState(0);

  // Latency Jitter
  useEffect(() => {
    if (status === 'connected') {
      setLiveLatency(selectedServer.latency);
      const interval = setInterval(() => {
        setLiveLatency(selectedServer.latency + Math.floor(Math.random() * 5) - 2);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setLiveLatency(0);
    }
  }, [status, selectedServer]);

  // NetShield Simulation
  useEffect(() => {
    if (status === 'connected' && (stealth.netshield.ads || stealth.netshield.trackers || stealth.netshield.malware)) {
      const interval = setInterval(() => {
        setBlockedCount(prev => prev + Math.floor(Math.random() * 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status, stealth.netshield]);

  const filteredServers = useMemo(() => {
    const query = serverSearch.toLowerCase().trim();
    if (!query) return SERVERS;
    return SERVERS.filter(server => 
      server.city.toLowerCase().includes(query) || 
      server.country.toLowerCase().includes(query) ||
      server.flag.includes(query)
    );
  }, [serverSearch]);

  const filteredApps = useMemo(() => {
    const query = appSearch.toLowerCase().trim();
    if (!query) return apps;
    return apps.filter(app => app.name.toLowerCase().includes(query));
  }, [appSearch, apps]);

  const protectedAppsCount = useMemo(() => {
    return apps.filter(app => app.enabled).length;
  }, [apps]);

  // Simulate connection process
  const handleToggleConnection = () => {
    if (status === 'connected') {
      setStatus('disconnected');
      setUptime(0);
    } else {
      setStatus('connecting');
      setTimeout(() => {
        setStatus('connected');
      }, 2000);
    }
  };

  // Uptime counter
  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
      interval = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleApp = (id: string) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, enabled: !app.enabled } : app));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-5 flex justify-between items-center border-b border-white/5 backdrop-blur-xl bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white tracking-tight">GVPN</h1>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {status === 'connected' ? 'Stealth Mode Active' : 'System Ready'}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <button onClick={() => setActiveTab('servers')} className={`${activeTab === 'servers' ? 'text-white' : 'hover:text-white'} transition-colors`}>Dashboard</button>
            <button onClick={() => setActiveTab('servers')} className={`${activeTab === 'servers' ? 'text-white' : 'hover:text-white'} transition-colors`}>Servers</button>
            <button onClick={() => setActiveTab('stealth')} className={`${activeTab === 'stealth' ? 'text-white' : 'hover:text-white'} transition-colors`}>Security</button>
            <a href="#" className="hover:text-white transition-colors">Account</a>
          </nav>
          <div className="h-6 w-px bg-white/10" />
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <button 
          className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8 overflow-hidden">
        
        {/* Left: Main Control Panel */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Connection Hub */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-[400px] h-[400px] border border-indigo-500/30 rounded-full" 
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute w-[600px] h-[600px] border border-blue-500/20 rounded-full" 
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Status Badge */}
              <motion.div 
                initial={false}
                animate={{ 
                  backgroundColor: status === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  color: status === 'connected' ? '#10b981' : '#f43f5e'
                }}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-current/20 flex items-center gap-2"
              >
                {status === 'connected' ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Undetectable
                  </>
                ) : status === 'connecting' ? 'Securing...' : 'Unprotected'}
              </motion.div>

              {/* Main Button */}
              <button 
                onClick={handleToggleConnection}
                disabled={status === 'connecting'}
                className="group relative w-64 h-64 flex items-center justify-center"
              >
                {/* Button Glow */}
                <AnimatePresence>
                  {status === 'connected' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"
                    />
                  )}
                </AnimatePresence>

                {/* Button Body */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative z-10 w-full h-full rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${
                    status === 'connected' 
                      ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_50px_rgba(79,70,229,0.4)]' 
                      : status === 'connecting'
                      ? 'bg-slate-800 border-indigo-500/50'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {status === 'connecting' ? (
                      <motion.div
                        key="connecting"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-16 h-16 text-indigo-400" />
                      </motion.div>
                    ) : status === 'connected' ? (
                      <motion.div key="connected" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <ShieldCheck className="w-16 h-16 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div key="disconnected" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Unlock className="w-16 h-16 text-slate-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <span className={`mt-4 font-display font-bold text-lg ${status === 'connected' ? 'text-white' : 'text-slate-400'}`}>
                    {status === 'connected' ? 'Disconnect' : status === 'connecting' ? 'Connecting' : 'Go Stealth'}
                  </span>
                </motion.div>
              </button>

              {/* Server Info */}
              <div className="mt-12 text-center">
                <p className="text-slate-400 text-sm mb-1 font-medium">Connected to</p>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-2xl">{selectedServer.flag}</span>
                  <h3 className="text-2xl font-display font-bold text-white">{selectedServer.city}</h3>
                </div>
                <div className="flex items-center gap-3 justify-center mt-2">
                  <p className="text-indigo-400 font-mono text-sm font-bold">192.168.1.104</p>
                  <div className="w-1 h-1 bg-slate-700 rounded-full" />
                  <div className="flex flex-col items-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      {stealth.residentialIp ? <Home className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      {stealth.residentialIp ? 'Residential IP' : 'Data Center IP'}
                    </p>
                    {tunnelMode === 'split' && status === 'connected' && (
                      <p className="text-[10px] text-indigo-400 font-bold mt-1">
                        {protectedAppsCount} Apps Protected
                      </p>
                    )}
                    {status === 'connected' && (stealth.netshield.ads || stealth.netshield.trackers || stealth.netshield.malware) && (
                      <div className="flex flex-col items-center gap-1 mt-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">NetShield Active</span>
                        </div>
                        {blockedCount > 0 && (
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                            {blockedCount} Threats Blocked
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              icon={Clock} 
              label="Session Time" 
              value={status === 'connected' ? formatTime(uptime) : '00:00:00'} 
              color="indigo" 
            />
            <StatCard 
              icon={Fingerprint} 
              label="Traffic Masking" 
              value={status === 'connected' ? 'HTTPS-Obf' : 'None'} 
              color="blue" 
            />
            <StatCard 
              icon={Activity} 
              label="Latency" 
              value={status === 'connected' ? `${liveLatency} ms` : '0 ms'} 
              color="emerald" 
            />
          </div>
        </div>

        {/* Right: Sidebar Tabs */}
        <div className="lg:w-96 flex flex-col gap-6">
          
          {/* Sidebar Container */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col h-full">
            
            {/* Tab Navigation */}
            <div className="flex p-1 bg-white/5 rounded-xl mb-6">
              <button 
                onClick={() => setActiveTab('servers')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'servers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Servers
              </button>
              <button 
                onClick={() => setActiveTab('stealth')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'stealth' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                Stealth
              </button>
              <button 
                onClick={() => setActiveTab('tunneling')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'tunneling' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                Split
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'servers' ? (
                <motion.div 
                  key="servers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-display font-bold text-white">Global Servers</h2>
                    <button 
                      onClick={() => setServerSearch('')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={serverSearch}
                      onChange={(e) => setServerSearch(e.target.value)}
                      placeholder="Search city, country, or flag..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {filteredServers.length > 0 ? (
                      filteredServers.map((server) => (
                        <button
                          key={server.id}
                          onClick={() => setSelectedServer(server)}
                          className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                            selectedServer.id === server.id 
                              ? 'bg-indigo-600/10 border-indigo-500/50' 
                              : 'bg-white/5 border-transparent hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{server.flag}</span>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-bold ${selectedServer.id === server.id ? 'text-white' : 'text-slate-300'}`}>
                                  {server.city}
                                </p>
                                {server.isResidential && <Home className="w-3 h-3 text-emerald-400" />}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{server.country}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Signal className={`w-3 h-3 ${server.latency < 100 ? 'text-emerald-400' : 'text-amber-400'}`} />
                              <span className="text-xs font-mono font-bold text-slate-400">{server.latency}ms</span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                          <Search className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No servers found</p>
                        <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : activeTab === 'stealth' ? (
                <motion.div 
                  key="stealth"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="mb-6">
                    <h2 className="text-lg font-display font-bold text-white mb-2">Advanced Stealth</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enable deep obfuscation to bypass VPN detection and DPI.
                    </p>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <Toggle 
                      icon={EyeOff}
                      label="Traffic Obfuscation"
                      enabled={stealth.obfuscation}
                      onChange={(v) => setStealth({ ...stealth, obfuscation: v })}
                    />
                    <Toggle 
                      icon={Home}
                      label="Residential IP Mode"
                      enabled={stealth.residentialIp}
                      onChange={(v) => setStealth({ ...stealth, residentialIp: v })}
                    />
                    <Toggle 
                      icon={Link}
                      label="Multi-Hop (Double VPN)"
                      enabled={stealth.multiHop}
                      onChange={(v) => setStealth({ ...stealth, multiHop: v })}
                    />
                    <Toggle 
                      icon={AlertTriangle}
                      label="Network Kill Switch"
                      enabled={stealth.killSwitch}
                      onChange={(v) => setStealth({ ...stealth, killSwitch: v })}
                    />

                    <div className="mt-6 mb-4">
                      <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        NetShield™ Protection
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1">DNS-level blocking for a cleaner web.</p>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => setStealth({ ...stealth, netshield: { ...stealth.netshield, ads: !stealth.netshield.ads } })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          stealth.netshield.ads ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-transparent'
                        }`}
                      >
                        <span className={`text-xs font-bold ${stealth.netshield.ads ? 'text-white' : 'text-slate-400'}`}>Block Ads</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${stealth.netshield.ads ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <motion.div animate={{ x: stealth.netshield.ads ? 18 : 2 }} className="absolute top-0.5 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </button>
                      <button 
                        onClick={() => setStealth({ ...stealth, netshield: { ...stealth.netshield, trackers: !stealth.netshield.trackers } })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          stealth.netshield.trackers ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-transparent'
                        }`}
                      >
                        <span className={`text-xs font-bold ${stealth.netshield.trackers ? 'text-white' : 'text-slate-400'}`}>Block Trackers</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${stealth.netshield.trackers ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <motion.div animate={{ x: stealth.netshield.trackers ? 18 : 2 }} className="absolute top-0.5 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </button>
                      <button 
                        onClick={() => setStealth({ ...stealth, netshield: { ...stealth.netshield, malware: !stealth.netshield.malware } })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          stealth.netshield.malware ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-transparent'
                        }`}
                      >
                        <span className={`text-xs font-bold ${stealth.netshield.malware ? 'text-white' : 'text-slate-400'}`}>Block Malware</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${stealth.netshield.malware ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <motion.div animate={{ x: stealth.netshield.malware ? 18 : 2 }} className="absolute top-0.5 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </button>
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <p className="text-xs font-bold text-amber-400 uppercase">Stealth Status</p>
                      </div>
                      <p className="text-[10px] text-amber-200/70 leading-relaxed">
                        With Residential IP and Obfuscation active, your traffic is indistinguishable from a standard home connection.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="tunneling"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="mb-6">
                    <h2 className="text-lg font-display font-bold text-white mb-2">Split Tunneling</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose which applications use the VPN connection and which use your local network.
                    </p>
                  </div>

                  {/* Mode Switcher */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setTunnelMode('full')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        tunnelMode === 'full' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-transparent text-slate-500'
                      }`}
                    >
                      <Layers className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase">Full Tunnel</span>
                    </button>
                    <button 
                      onClick={() => setTunnelMode('split')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        tunnelMode === 'split' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-transparent text-slate-500'
                      }`}
                    >
                      <Split className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase">Split Tunnel</span>
                    </button>
                  </div>

                  {/* App List */}
                  <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${tunnelMode === 'full' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search apps..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {filteredApps.length > 0 ? (
                        filteredApps.map(app => (
                          <button 
                            key={app.id}
                            onClick={() => toggleApp(app.id)}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                              app.enabled ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{app.icon}</span>
                              <span className={`text-xs font-bold ${app.enabled ? 'text-white' : 'text-slate-400'}`}>{app.name}</span>
                            </div>
                            {app.enabled && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-slate-500">No apps found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* System Health */}
            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">CPU Usage</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">Memory</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">2.4 GB</span>
              </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2 relative z-10">Military-Grade Encryption</h3>
            <p className="text-indigo-100 text-xs leading-relaxed relative z-10">
              Your data is protected by AES-256-GCM encryption with Perfect Forward Secrecy.
            </p>
            <button className="mt-4 flex items-center gap-2 text-xs font-bold text-white group/btn relative z-10">
              View Security Audit
              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-8 text-2xl font-display font-bold">
              <button onClick={() => { setActiveTab('servers'); setIsMenuOpen(false); }} className={activeTab === 'servers' ? 'text-indigo-400' : 'text-slate-400'}>Dashboard</button>
              <button onClick={() => { setActiveTab('servers'); setIsMenuOpen(false); }} className={activeTab === 'servers' ? 'text-indigo-400' : 'text-slate-400'}>Servers</button>
              <button onClick={() => { setActiveTab('stealth'); setIsMenuOpen(false); }} className={activeTab === 'stealth' ? 'text-indigo-400' : 'text-slate-400'}>Security</button>
              <a href="#" className="text-slate-400">Account</a>
              <a href="#" className="text-slate-400">Settings</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
