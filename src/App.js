import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Plus, Trash2, Download, LayoutTemplate, Palette, Type } from "lucide-react";

// --- INITIAL STATE ---
const initialData = {
  personal: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    address: "New York, USA",
    summary: "Experienced professional with a passion for building scalable web applications."
  },
  experience: [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      date: "2020 - Present",
      description: "Developed main user dashboard and optimized database queries."
    }
  ],
  education: [
    {
      id: 1,
      degree: "B.Sc Computer Science",
      school: "University of Tech",
      date: "2016 - 2020"
    }
  ],
  skills: ["React", "JavaScript", "Node.js", "Tailwind CSS"]
};

const FormSection = ({ title, children }) => (
  <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-700 mb-3 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text", isTextArea = false }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    {isTextArea ? (
      <textarea
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        type={type}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export default function App() {
  const [data, setData] = useState(initialData);
  const [color, setColor] = useState("#2563eb");
  const [font, setFont] = useState("font-sans");
  const [template, setTemplate] = useState("classic");

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data.personal.fullName}_Resume`
  });

  const handlePersonalChange = (field, value) => {
    setData({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const handleArrayChange = (section, id, field, value) => {
    const updatedSection = data[section].map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setData({ ...data, [section]: updatedSection });
  };

  const addItem = (section, newItem) => {
    setData({ ...data, [section]: [...data[section], { ...newItem, id: Date.now() }] });
  };

  const removeItem = (section, id) => {
    setData({ ...data, [section]: data[section].filter((item) => item.id !== id) });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...data.skills];
    updatedSkills[index] = value;
    setData({ ...data, skills: updatedSkills });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      <div className="w-full md:w-1/3 p-6 overflow-y-auto h-screen border-r bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Download size={18} /> Export
          </button>
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">Customization</h3>
          <div className="flex gap-4">
            <button onClick={() => setTemplate(template === "classic" ? "modern" : "classic")}>
              <LayoutTemplate size={20} />
            </button>

            <div className="flex flex-col items-center gap-1">
              <Palette size={20} />
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 p-0 rounded" />
            </div>

            <button onClick={() => setFont(font === "font-sans" ? "font-serif" : "font-sans")}>
              <Type size={20} />
            </button>
          </div>
        </div>

        <FormSection title="Personal Information">
          <InputGroup label="Full Name" value={data.personal.fullName} onChange={(v) => handlePersonalChange("fullName", v)} />
          <InputGroup label="Email" value={data.personal.email} onChange={(v) => handlePersonalChange("email", v)} />
          <InputGroup label="Phone" value={data.personal.phone} onChange={(v) => handlePersonalChange("phone", v)} />
          <InputGroup label="Address" value={data.personal.address} onChange={(v) => handlePersonalChange("address", v)} />
          <InputGroup label="Summary" value={data.personal.summary} onChange={(v) => handlePersonalChange("summary", v)} isTextArea />
        </FormSection>

        <FormSection title="Experience">
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 pb-4 border-b relative">
              <button onClick={() => removeItem("experience", exp.id)} className="absolute top-0 right-0 text-red-500">
                <Trash2 size={16} />
              </button>

              <InputGroup label="Job Title" value={exp.title} onChange={(v) => handleArrayChange("experience", exp.id, "title", v)} />
              <InputGroup label="Company" value={exp.company} onChange={(v) => handleArrayChange("experience", exp.id, "company", v)} />
              <InputGroup label="Date" value={exp.date} onChange={(v) => handleArrayChange("experience", exp.id, "date", v)} />
              <InputGroup label="Description" value={exp.description} onChange={(v) => handleArrayChange("experience", exp.id, "description", v)} isTextArea />
            </div>
          ))}

          <button
            onClick={() => addItem("experience", { title: "New Role", company: "", date: "", description: "" })}
            className="w-full py-2 border-2 border-dashed rounded text-gray-500"
          >
            <Plus size={16} /> Add Experience
          </button>
        </FormSection>

        <FormSection title="Skills">
          {data.skills.map((skill, i) => (
            <input
              key={i}
              className="p-2 border rounded w-full mb-2"
              value={skill}
              onChange={(e) => handleSkillChange(i, e.target.value)}
            />
          ))}
          <button className="text-blue-500 mt-2" onClick={() => setData({ ...data, skills: [...data.skills, "New Skill"] })}>
            + Add Skill
          </button>
        </FormSection>
      </div>

      <div className="w-full md:w-2/3 bg-gray-200 p-8 overflow-y-auto h-screen flex justify-center">
        <div ref={componentRef} className={`bg-white shadow-2xl w-[210mm] min-h-[297mm] p-10 ${font}`}>
          <header className="pb-6 mb-6 border-b" style={{ borderColor: color }}>
            <h1 className="text-4xl font-bold" style={{ color: color }}>
              {data.personal.fullName}
            </h1>
            <p className="text-lg mt-2 text-gray-600">{data.personal.summary}</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>{data.personal.email}</p>
              <p>{data.personal.phone}</p>
              <p>{data.personal.address}</p>
            </div>
          </header>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: color }}>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <span className="text-sm text-gray-500">{exp.date}</span>
                </div>
                <p className="font-semibold">{exp.company}</p>
                <p className="text-sm mt-1 text-gray-600">{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: color }}>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm text-gray-500">{edu.date}</span>
                </div>
                <p className="text-gray-700">{edu.school}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: color }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
  }
