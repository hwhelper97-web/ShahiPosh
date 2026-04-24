'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Mail, Search, Trash2, Eye, CheckCircle, Clock, Send, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: 'READ' } : m));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/contact/${replyingTo.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText,
          originalMessage: replyingTo.message,
          customerEmail: replyingTo.email,
          subject: replyingTo.subject
        })
      });
      if (res.ok) {
        alert('Reply sent successfully!');
        setReplyingTo(null);
        setReplyText('');
        fetchMessages(); // Refresh to see READ status
      }
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="space-y-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Mail size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Communications Hub</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter">Inquiries</h1>
            <p className="text-muted-foreground">Manage customer messages and dispatch professional responses.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-border shadow-sm">
          <Search size={18} className="text-muted-foreground ml-4" />
          <input 
            type="text" 
            placeholder="Filter by name, email or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Inbox...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-border shadow-xl">
            <Mail size={48} className="mx-auto text-muted-foreground/20 mb-6" />
            <h3 className="text-xl font-bold">No Messages Found</h3>
            <p className="text-muted-foreground">When customers contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-luxury ${
                      msg.status === 'UNREAD' ? 'bg-red-50 text-red-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Mail size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold">{msg.name}</h3>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          msg.status === 'UNREAD' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-accent mb-4">{msg.email}</p>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Subject</p>
                        <p className="text-lg font-extrabold tracking-tight text-primary">{msg.subject}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between text-right">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {format(new Date(msg.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-luxury flex items-center gap-2 px-6"
                      >
                        <Send size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Reply</span>
                      </button>
                      <button 
                        onClick={() => handleMarkAsRead(msg.id)}
                        className={`p-3 rounded-xl transition-luxury ${
                          msg.status === 'READ' 
                            ? 'bg-green-50 text-green-600 border border-green-100 cursor-default' 
                            : 'bg-muted hover:bg-green-600 hover:text-white'
                        }`}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-3 rounded-xl bg-muted hover:bg-red-600 hover:text-white transition-luxury"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border bg-muted/20 p-6 rounded-2xl border-dashed">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{msg.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {replyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-black p-10 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-accent">Compose Reply</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">Replying to: {replyingTo.email}</p>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="p-6 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Original Inquiry</p>
                  <p className="text-sm italic text-muted-foreground">"{replyingTo.message}"</p>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Your Response</label>
                  <textarea 
                    rows={8}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your professional response here..."
                    className="w-full bg-muted border-none rounded-[2rem] px-8 py-6 text-sm focus:ring-1 focus:ring-accent outline-none resize-none"
                  />
                </div>
                <button 
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="btn-premium w-full py-5 flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                >
                  {sendingReply ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  <span className="font-bold uppercase tracking-widest text-sm">Dispatch Official Reply</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
