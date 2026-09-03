import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Send, CheckCircle, Clock, Inbox, MessageSquare, AlertCircle } from 'lucide-react';

export default function Support() {
  const { tickets, replyToTicket, resolveTicket } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [replyInput, setReplyInput] = useState('');

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedTicketId) return;
    replyToTicket(selectedTicketId, replyInput.trim());
    setReplyInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Page Header */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Support Ticketing System</h3>
        <p className="text-xs text-gray-500">Read inquiries, submit responses, and resolve active platform issues</p>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Pane: Tickets List */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-white/5 bg-darkbg-card overflow-hidden">
          {/* List Controls */}
          <div className="p-4 border-b border-white/5 space-y-3.5 bg-black/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-black/30 border border-white/5 overflow-x-auto text-[9px] font-bold uppercase">
              {['all', 'open', 'pending', 'resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 px-2.5 py-1.5 rounded-md text-center transition-all ${
                    statusFilter === status 
                      ? 'bg-gold text-darkbg shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Scroll View */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {filteredTickets.map((t) => {
              const lastMsg = t.messages[t.messages.length - 1];
              const isSelected = t.id === selectedTicketId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full p-4 text-left flex flex-col justify-between transition-colors border-l-2 ${
                    isSelected 
                      ? 'bg-white/[0.04] border-gold' 
                      : 'hover:bg-white/[0.02] border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-white">{t.id}</span>
                    <span className={`inline-flex px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase ${
                      t.status === 'open' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                        : t.status === 'pending'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                        : 'bg-white/5 text-gray-500 border border-white/5'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-gray-200 mt-2 truncate max-w-[200px]">
                    {t.subject}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">
                    {t.userName} • {t.createdTime}
                  </p>
                  {lastMsg && (
                    <p className="text-[9px] text-gray-500 mt-1.5 truncate italic">
                      Last: {lastMsg.text}
                    </p>
                  )}
                </button>
              );
            })}
            
            {filteredTickets.length === 0 && (
              <div className="h-44 flex flex-col justify-center items-center text-gray-500 space-y-1.5">
                <Inbox size={24} />
                <span className="text-xs font-semibold">No tickets in this tab</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Conversation History Chat Panel */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/5 bg-darkbg-card overflow-hidden">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 bg-black/25 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    {activeTicket.subject}
                    <span className="ml-2 font-mono text-[10px] text-gray-500 font-normal">({activeTicket.id})</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    User: <span className="font-semibold text-gray-200">{activeTicket.userName}</span> ({activeTicket.userId})
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeTicket.status === 'open' 
                      ? 'bg-emerald-950 text-emerald-400' 
                      : activeTicket.status === 'pending'
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-white/5 text-gray-500'
                  }`}>
                    {activeTicket.status}
                  </span>
                  
                  {activeTicket.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        resolveTicket(activeTicket.id);
                      }}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:text-emerald-400 rounded-lg text-[10px] font-bold flex items-center transition-all"
                    >
                      <CheckCircle size={12} className="mr-1" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Message Scroll list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/10 scrollbar-thin">
                <div className="text-center py-2">
                  <span className="px-2.5 py-1 rounded bg-black/30 text-[9px] font-semibold text-gray-500 border border-white/5">
                    Ticket Created {activeTicket.createdTime}
                  </span>
                </div>

                {activeTicket.messages.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div 
                      key={idx} 
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1.5 shadow ${
                        isAdmin 
                          ? 'bg-gold/10 border border-gold/25 text-white rounded-tr-none' 
                          : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className="flex justify-end items-center text-[9px] text-gray-500 font-semibold space-x-1">
                          <span>{msg.timestamp}</span>
                          {isAdmin && <span className="text-gold">• Admin</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form at the Bottom */}
              {activeTicket.status !== 'resolved' ? (
                <form onSubmit={handleSendReply} className="p-3 border-t border-white/5 bg-black/25 flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Type administrative response reply here..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold/50"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim()}
                    className="p-2.5 rounded-xl bg-gold text-darkbg hover:bg-gold-light disabled:opacity-40 transition-colors flex items-center justify-center"
                    title="Send Reply"
                  >
                    <Send size={15} />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-950/20 border-t border-white/5 text-center text-xs text-emerald-400 font-bold flex items-center justify-center">
                  <CheckCircle size={15} className="mr-2" /> This ticket is closed and resolved.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500 space-y-2">
              <MessageSquare size={32} className="text-gray-600 animate-float" />
              <h4 className="text-sm font-bold text-gray-300">Select a Ticket</h4>
              <p className="text-xs text-gray-500 max-w-xs text-center">
                Click a ticket from the left panel index to read history logs and write replies.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
