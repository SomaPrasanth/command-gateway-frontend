import { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '');
  const [user, setUser] = useState(null);
  const [command, setCommand] = useState('');
  const [outputLog, setOutputLog] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [newRule, setNewRule] = useState({ pattern: '', action: 'block', description: '' });
  const [newUserForm, setNewUserForm] = useState({ username: '', role: 'member' });
  const [createdUserKey, setCreatedUserKey] = useState(null); // Stores the key temporarily

  // --- AUTHENTICATION ---
  const login = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { 'x-api-key': apiKey }
      });
      setUser(res.data);
      localStorage.setItem('api_key', apiKey);
      setOutputLog([{ type: 'info', text: `System initialized. Welcome, ${res.data.username}.` }]);
    } catch (err) {
      alert("Access Denied: Invalid API Key");
    }
  };

  const logout = () => {
    setUser(null);
    setApiKey('');
    localStorage.removeItem('api_key');
  };

  // --- COMMAND EXECUTION ---
  const executeCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newLog = [...outputLog, { type: 'user', text: `> ${command}` }];
    setOutputLog(newLog);
    
    try {
      const res = await axios.post(`${API_URL}/commands/execute`, 
        { command: command },
        { headers: { 'x-api-key': apiKey } }
      );
      
      const responseLog = {
        type: res.data.status === 'EXECUTED' ? 'success' : 'error',
        text: `[${res.data.status}] ${res.data.message}`
      };
      
      setOutputLog([...newLog, responseLog]);
      setUser({ ...user, credits: res.data.credits_remaining });

    } catch (err) {
      setOutputLog([...newLog, { type: 'error', text: "Error: Connection lost or server failure." }]);
    }
    setCommand('');
  };

  // --- ADMIN: ADD RULE ---
  const addRule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/rules`, newRule, {
        headers: { 'x-api-key': apiKey }
      });
      alert("New Protocol Established (Rule Added)");
      setNewRule({ pattern: '', action: 'block', description: '' });
    } catch (err) {
      alert("Error: Invalid Regex Pattern");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/audit-logs`, {
        headers: { 'x-api-key': apiKey }
      });
      setAuditLogs(res.data);
    } catch (err) {
      alert("Failed to fetch logs");
    }
  };

  // --- VIEW: LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="login-screen">
        <h1 style={{fontSize: '2rem', letterSpacing: '5px'}}>COMMAND GATEWAY</h1>
        <div className="login-box">
          <input
            type="text"
            placeholder="ENTER API KEY"
            className="command-input"
            style={{ textAlign: 'center', marginBottom: '15px' }}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button onClick={login} className="save-btn" style={{ width: '100%', background: '#238636', color: 'white' }}>
            AUTHENTICATE
          </button>
          <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#8b949e' }}>
            Use: member-secret-key or admin-secret-key
          </p>
        </div>
      </div>
    );
  }

  // --- VIEW: MAIN DASHBOARD ---
  return (
    <div className="app-container">
      
      {/* LEFT: TERMINAL */}
      <div className="terminal-section">
        {/* Header Stats */}
        <div className="header-stats">
          <div>
            <span className="stat-label">IDENTITY</span>
            <div className="stat-value">
              {user.username} <span style={{fontSize: '0.7em', border: '1px solid #58a6ff', padding: '0 4px', borderRadius: '3px'}}>{user.role}</span>
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <span className="stat-label">AVAILABLE CREDITS</span>
            <div className={`stat-value ${user.credits > 0 ? 'credits-high' : 'credits-low'}`}>
              {user.credits}
            </div>
          </div>
          <button onClick={logout} className="logout-btn">DISCONNECT</button>
        </div>

        {/* Console Window */}
        <div className="console-window">
          {outputLog.map((log, index) => (
            <div key={index} className={`log-entry log-${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={executeCommand} className="command-form">
          <span className="prompt-char">{'>'}</span>
          <input 
            autoFocus
            type="text" 
            className="command-input"
            placeholder="Awaiting command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        </form>
      </div>

      {/* RIGHT: ADMIN PANEL */}
      {user.role === 'admin' && (
        <div className="admin-panel">
          <h2 className="admin-title">ADMIN CONTROL</h2>
          
          {/* Section 1: Add Rule */}
          <div style={{marginBottom: '30px'}}>
            <h3 className="stat-label" style={{marginBottom: '10px'}}>DEPLOY NEW RULE</h3>
            <form onSubmit={addRule} className="rule-form">
              <input 
                type="text" placeholder="Regex Pattern (e.g. ^git status)" 
                className="admin-input"
                value={newRule.pattern} onChange={(e) => setNewRule({...newRule, pattern: e.target.value})}
              />
              <div style={{display:'flex', gap:'5px'}}>
                <select 
                  className="admin-input" style={{flex:1}}
                  value={newRule.action} onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                >
                  <option value="block">BLOCK</option>
                  <option value="allow">ALLOW</option>
                </select>
                <input 
                  type="text" placeholder="Description" 
                  className="admin-input" style={{flex:2}}
                  value={newRule.description} onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                />
              </div>
              <button className="save-btn">DEPLOY RULE</button>
            </form>
          </div>

          {/* Section 2: Audit Logs */}
          <div style={{borderTop: '1px solid #30363d', paddingTop: '20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
              <h3 className="stat-label">SYSTEM AUDIT TRAIL</h3>
              <button onClick={fetchLogs} style={{background:'none', border:'1px solid #58a6ff', color:'#58a6ff', cursor:'pointer', fontSize:'0.7rem', padding:'2px 8px'}}>REFRESH</button>
            </div>
            
            <div className="logs-table-container">
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.75rem'}}>
                <thead>
                  <tr style={{textAlign:'left', color:'#8b949e', borderBottom: '1px solid #30363d'}}>
                    <th style={{padding:'8px'}}>TIME</th>
                    <th style={{padding:'8px', color: '#58a6ff'}}>USER</th> 
                    <th style={{padding:'8px'}}>CMD</th>
                    <th style={{padding:'8px'}}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} style={{borderBottom:'1px solid #21262d'}}>
                      <td style={{padding:'8px', color:'#8b949e'}}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{padding:'8px', fontWeight:'bold', color:'#e2e8f0'}}>
                        {log.username} 
                      </td>
                      <td style={{padding:'8px', fontFamily:'monospace', color:'#d29922'}}>
                        {log.command}
                      </td>
                      <td style={{padding:'8px', fontWeight:'bold', 
                        color: log.status === 'EXECUTED' ? '#3fb950' : '#f85149'
                      }}>
                        {log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {auditLogs.length === 0 && <div style={{textAlign:'center', padding:'20px', color:'#8b949e'}}>No logs loaded</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;