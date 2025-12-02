import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

function Field({label, value, onChange, textarea}){
  return (
    <div style={{marginBottom:12}}>
      <label className='label'>{label}</label>
      {textarea ? (
        <textarea className='input' rows={4} value={value} onChange={(e)=>onChange(e.target.value)} />
      ) : (
        <input className='input' value={value} onChange={(e)=>onChange(e.target.value)} />
      )}
    </div>
  )
}

function Preview({data}){
  return (
    <div className='preview' id="resume-preview" style={{color:'#111'}}>
      <div style={{borderBottom:'2px solid var(--accent)',paddingBottom:12,marginBottom:12}}>
        <h1 style={{margin:0}}>{data.personal.name}</h1>
        <div className='small'>{data.personal.email} • {data.personal.phone}</div>
      </div>
      <section style={{marginBottom:12}}>
        <h3 style={{margin:'6px 0'}}>Summary</h3>
        <div className='small'>{data.personal.summary}</div>
      </section>
      <section style={{marginBottom:12}}>
        <h3 style={{margin:'6px 0'}}>Experience</h3>
        {data.experience.map((exp)=> (
          <div key={exp.id} style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong>{exp.title} — {exp.company}</strong>
              <span className='small'>{exp.date}</span>
            </div>
            <div className='small'>{exp.description}</div>
          </div>
        ))}
      </section>
      <section>
        <h3 style={{margin:'6px 0'}}>Skills</h3>
        <div className='row' style={{flexWrap:'wrap'}}>
          {data.skills.map((s,i)=>(<span key={i} className='tag'>{s}</span>))}
        </div>
      </section>
    </div>
  )
}

export default function App(){
  const [personal, setPersonal] = useState({name:'Your Name', email:'you@example.com', phone:'', summary:'Write a short professional summary...'});
  const [experience, setExperience] = useState([{id:Date.now(), title:'Frontend Developer', company:'Company', date:'2022 - Present', description:'Worked on UI...'}]);
  const [skills, setSkills] = useState(['React','JavaScript']);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: (personal.name || 'resume') + '_resume'
  });

  function addExperience(){
    setExperience([...experience, {id:Date.now(), title:'New Role', company:'', date:'', description:''}])
  }

  return (
    <div className='container'>
      <div className='card header'>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className='logo'>S</div>
          <div>
            <div className='title'>Sleek Maker</div>
            <div className='small'>Create a professional resume — export to PDF</div>
          </div>
        </div>
        <div style={{marginLeft:'auto'}} className='row'>
          <button className='btn' onClick={handlePrint}>Download PDF</button>
        </div>
      </div>

      <div className='grid' style={{marginTop:12}}>
        <div className='col card'>
          <h3>Personal</h3>
          <Field label='Full name' value={personal.name} onChange={(v)=>setPersonal({...personal, name:v})} />
          <Field label='Email' value={personal.email} onChange={(v)=>setPersonal({...personal, email:v})} />
          <Field label='Phone' value={personal.phone} onChange={(v)=>setPersonal({...personal, phone:v})} />
          <Field label='Summary' textarea value={personal.summary} onChange={(v)=>setPersonal({...personal, summary:v})} />

          <h3 style={{marginTop:12}}>Experience</h3>
          {experience.map((exp, idx)=>(
            <div key={exp.id} style={{marginBottom:10}}>
              <Field label='Title' value={exp.title} onChange={(v)=>{ const next=[...experience]; next[idx].title=v; setExperience(next)}} />
              <Field label='Company' value={exp.company} onChange={(v)=>{ const next=[...experience]; next[idx].company=v; setExperience(next)}} />
              <Field label='Date' value={exp.date} onChange={(v)=>{ const next=[...experience]; next[idx].date=v; setExperience(next)}} />
              <Field label='Description' textarea value={exp.description} onChange={(v)=>{ const next=[...experience]; next[idx].description=v; setExperience(next)}} />
            </div>
          ))}
          <div style={{display:'flex',gap:8}}>
            <button className='btn' onClick={addExperience}>Add Experience</button>
            <button className='btn' onClick={()=>{ setSkills([...skills,'New Skill']) }} style={{background:'#10b981'}}>Add Skill</button>
          </div>
        </div>

        <div className='col'>
          <div className='card'>
            <h3>Preview</h3>
            <div ref={componentRef}>
              <Preview data={{ personal, experience, skills }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
