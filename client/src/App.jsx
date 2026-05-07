import { useState } from 'react';

function App() {
  const [vulnUsername, setVulnUsername] = useState('');
  const [vulnPassword, setVulnPassword] = useState('');
  const [vulnResult, setVulnResult] = useState(null);

  const [secureUsername, setSecureUsername] = useState('');
  const [securePassword, setSecurePassword] = useState('');
  const [secureResult, setSecureResult] = useState(null);

  const payload = "' OR 1=1 --";

  const handleInjectVuln = () => {
    setVulnUsername(payload);
    setVulnPassword('anything');
  };

  const handleInjectSecure = () => {
    setSecureUsername(payload);
    setSecurePassword('anything');
  };

  const handleLoginVuln = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login-vulnerable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: vulnUsername, password: vulnPassword })
      });
      const data = await res.json();
      setVulnResult(data);
    } catch (err) {
      console.error(err);
      setVulnResult({ success: false, message: 'Server error' });
    }
  };

  const handleLoginSecure = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login-secure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: secureUsername, password: securePassword })
      });
      const data = await res.json();
      setSecureResult(data);
    } catch (err) {
      console.error(err);
      setSecureResult({ success: false, message: 'Server error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>

      <header className="mb-12 text-center z-10">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 tracking-tight">
          SQL Injection Simulator
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Explore the difference between vulnerable queries and parameterized secure queries in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl z-10">
        
        {/* Vulnerable System */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-red-900/20 relative group transition-all duration-300 hover:border-red-500/60">
          <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            VULNERABLE
          </div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            Direct String Concatenation
          </h2>
          
          <form onSubmit={handleLoginVuln} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={vulnUsername}
                  onChange={(e) => setVulnUsername(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono text-sm"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={vulnPassword}
                onChange={(e) => setVulnPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <button 
                type="button" 
                onClick={handleInjectVuln}
                className="text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                💉 Inject Payload
              </button>
              
              <button 
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-red-500/30 transition-all transform hover:scale-105"
              >
                Login
              </button>
            </div>
          </form>

          {vulnResult && (
            <div className={`mt-8 p-4 rounded-xl border ${vulnResult.success ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-700/30 border-slate-600'}`}>
              <h3 className={`font-bold mb-2 ${vulnResult.success ? 'text-red-400' : 'text-slate-300'}`}>
                {vulnResult.success ? '🚨 SYSTEM BREACHED!' : 'Login Failed'}
              </h3>
              <p className="text-sm text-slate-300 mb-2">{vulnResult.message}</p>
              {vulnResult.success && vulnResult.user && (
                <div className="bg-black/40 p-3 rounded-lg font-mono text-xs text-red-300 border border-red-500/30">
                  <p>Exposed User Data:</p>
                  <pre>{JSON.stringify(vulnResult.user, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Secure System */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-900/20 relative group transition-all duration-300 hover:border-emerald-500/60">
          <div className="absolute top-0 left-8 transform -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            SECURE
          </div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            Parameterized Queries
          </h2>
          
          <form onSubmit={handleLoginSecure} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={secureUsername}
                  onChange={(e) => setSecureUsername(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={securePassword}
                onChange={(e) => setSecurePassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <button 
                type="button" 
                onClick={handleInjectSecure}
                className="text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                💉 Inject Payload
              </button>
              
              <button 
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
              >
                Login
              </button>
            </div>
          </form>

          {secureResult && (
            <div className={`mt-8 p-4 rounded-xl border ${!secureResult.success && secureUsername.includes("' OR ") ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-700/30 border-slate-600'}`}>
              <h3 className={`font-bold mb-2 ${!secureResult.success && secureUsername.includes("' OR ") ? 'text-emerald-400' : (secureResult.success ? 'text-emerald-400' : 'text-slate-300')}`}>
                {!secureResult.success && secureUsername.includes("' OR ") 
                  ? '🛡️ ATTACK BLOCKED!' 
                  : (secureResult.success ? '✅ Login Successful' : 'Login Failed')}
              </h3>
              <p className="text-sm text-slate-300 mb-2">{secureResult.message}</p>
              {!secureResult.success && secureUsername.includes("' OR ") && (
                <div className="bg-black/40 p-3 rounded-lg font-mono text-xs text-emerald-300 border border-emerald-500/30">
                  <p>The system safely treated the payload as a literal string:</p>
                  <pre className="mt-1 opacity-80">"{secureUsername}"</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
