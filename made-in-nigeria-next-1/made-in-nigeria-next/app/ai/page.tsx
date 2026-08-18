"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Bot, Copy, FileText, Menu, Plus, Send, Sparkles, Trash2, UserRound, WandSparkles } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type Assignment = { id:string; title:string; instructions:string|null; content:string|null; status:string; course_id:string|null };
type Message = { id:string; role:"user"|"assistant"; content:string };

export default function AIPage() {
  const supabase=createClient();
  const searchParams=useSearchParams();
  const assignmentId=searchParams.get("assignment");
  const [assignment,setAssignment]=useState<Assignment|null>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  const [input,setInput]=useState("");
  const [sending,setSending]=useState(false);
  const [loading,setLoading]=useState(true);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  useEffect(()=>{async function load(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    if(assignmentId){
      const {data}=await supabase.from("assignments").select("id,title,instructions,content,status,course_id").eq("id",assignmentId).eq("user_id",user.id).single();
      if(data)setAssignment(data as Assignment);
    }
    setLoading(false);
  } load()},[assignmentId,supabase]);

  const suggestions=useMemo(()=>assignment?[
    "Explain this assignment in simple terms",
    "Create an outline for this assignment",
    "Help me understand what my lecturer expects",
    "Give me ideas for my introduction",
  ]:[
    "Explain a difficult topic to me",
    "Help me create an assignment outline",
    "Improve this paragraph",
    "Help me study for an exam",
  ],[assignment]);

  function addMessage(role:"user"|"assistant",content:string){
    setMessages(m=>[...m,{id:`${Date.now()}-${Math.random()}`,role,content}]);
  }

  async function sendMessage(text=input){
    const message=text.trim();
    if(!message||sending)return;
    setInput(""); addMessage("user",message); setSending(true);
    window.setTimeout(()=>{
      const context=assignment?`I have your assignment "${assignment.title}" in context. `:"";
      addMessage("assistant",`${context}The AI connection is ready to be connected. Your request was: "${message}"\n\nIn the next step, we'll connect this interface to the CampusMind AI API so I can actually answer the request.`);
      setSending(false);
    },700);
  }

  function submit(e:FormEvent){e.preventDefault();void sendMessage();}
  function clearChat(){setMessages([]);}
  async function copyMessage(content:string){try{await navigator.clipboard.writeText(content)}catch{}}

  if(loading)return <div className="cm-full-loader"><div className="cm-loader"/><span>Loading CampusMind AI...</span></div>;

  return <div className="cm-ai-page">
    <header className="cm-ai-topbar">
      <div className="cm-ai-top-left">
        <button className="cm-ai-menu-button" onClick={()=>setSidebarOpen(v=>!v)} aria-label="Toggle AI menu"><Menu size={19}/></button>
        <Link href="/dashboard" className="cm-ai-back"><ArrowLeft size={15}/> Dashboard</Link>
        <div className="cm-ai-brand"><div className="cm-ai-brand-icon"><Sparkles size={15}/></div><div><b>CampusMind AI</b><span>Study assistant</span></div></div>
      </div>
      <button className="cm-ai-new" onClick={clearChat}><Plus size={15}/> New chat</button>
    </header>

    <div className={`cm-ai-layout ${sidebarOpen?"menu-open":""}`}>
      <aside className="cm-ai-sidebar">
        <div className="cm-ai-sidebar-heading"><span>AI TOOLS</span><button onClick={()=>setSidebarOpen(false)}>×</button></div>
        <button className="cm-ai-tool active"><Bot size={16}/> AI Chat</button>
        <button className="cm-ai-tool"><WandSparkles size={16}/> Writing assistant</button>
        <button className="cm-ai-tool"><BookOpen size={16}/> Study help</button>
        <button className="cm-ai-tool"><FileText size={16}/> Summarize</button>
        {assignment&&<div className="cm-ai-context"><p>ASSIGNMENT CONTEXT</p><div><FileText size={15}/><span>{assignment.title}</span></div><Link href={`/assignments/${assignment.id}`}>Open assignment</Link></div>}
        <div className="cm-ai-sidebar-bottom"><button className="cm-ai-tool danger" onClick={clearChat}><Trash2 size={15}/> Clear conversation</button></div>
      </aside>

      <main className="cm-ai-main">
        <div className="cm-ai-chat">
          {messages.length===0?<div className="cm-ai-welcome">
            <div className="cm-ai-welcome-icon"><Sparkles size={24}/></div>
            <p className="cm-page-kicker">YOUR STUDY ASSISTANT</p>
            <h1>{assignment?"Let's work on your assignment.":"What can I help you study?"}</h1>
            <p>Ask questions, understand difficult topics, plan assignments, or improve your academic writing.</p>
            <div className="cm-ai-suggestions">{suggestions.map(s=><button key={s} onClick={()=>void sendMessage(s)}><Sparkles size={14}/><span>{s}</span></button>)}</div>
          </div>:<div className="cm-ai-messages">
            {messages.map(m=><div key={m.id} className={`cm-ai-message-row ${m.role}`}>
              <div className={`cm-ai-avatar ${m.role==="assistant"?"ai":"user"}`}>{m.role==="assistant"?<Sparkles size={15}/>:<UserRound size={15}/>}</div>
              <div className="cm-ai-message-body"><div className="cm-ai-message-name">{m.role==="assistant"?"CampusMind AI":"You"}</div><div className="cm-ai-message-text">{m.content}</div>{m.role==="assistant"&&<button className="cm-ai-copy" onClick={()=>void copyMessage(m.content)}><Copy size={12}/> Copy</button>}</div>
            </div>)}
            {sending&&<div className="cm-ai-message-row assistant"><div className="cm-ai-avatar ai"><Sparkles size={15}/></div><div className="cm-ai-message-body"><div className="cm-ai-message-name">CampusMind AI</div><div className="cm-ai-thinking"><span/><span/><span/></div></div></div>}
          </div>}
        </div>

        <div className="cm-ai-composer-area">
          {assignment&&<div className="cm-ai-context-pill"><FileText size={13}/> Working with: <b>{assignment.title}</b></div>}
          <form className="cm-ai-composer" onSubmit={submit}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void sendMessage()}}} placeholder={assignment?"Ask something about this assignment...":"Ask CampusMind anything about your studies..."} rows={1}/>
            <button className="cm-ai-send" type="submit" disabled={!input.trim()||sending} aria-label="Send message"><Send size={16}/></button>
          </form>
          <p className="cm-ai-disclaimer">CampusMind AI can make mistakes. Always verify important academic information.</p>
        </div>
      </main>
    </div>
  </div>;
}
