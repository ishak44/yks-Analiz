
import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { 
  ComposedChart,
  Line,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

import { Student, ClassGroup, Exam, ExamResult, AnalysisStatus, ExamType } from './types';
import * as storage from './services/storageService';
import { analyzeStudentPerformance } from './services/geminiService';

import { StatCard } from './components/StatCard';
import { StudentManager } from './components/AddTransactionModal'; 
import { ExamManager } from './components/ExamManager';
import { ExamAnalysis } from './components/ExamAnalysis';
import { AIAnalysisModal } from './components/AIAnalysisModal';

// UUID Generator Polyfill
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'exams' | 'rankings' | 'analysis'>('dashboard');
  
  // Data State
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Dashboard Filter State
  const [dashboardType, setDashboardType] = useState<ExamType>('TYT');
  const [dashboardClassId, setDashboardClassId] = useState<string>('');
  const [dashboardStudentId, setDashboardStudentId] = useState<string>('');

  // Analysis State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState(AnalysisStatus.IDLE);
  const [aiContent, setAiContent] = useState('');
  const [selectedStudentForAnalysis, setSelectedStudentForAnalysis] = useState<string>('');

  // Veritabanından Verileri Çek
  const refreshData = async () => {
    try {
        const [cls, std, exm, res] = await Promise.all([
            storage.getClasses(),
            storage.getStudents(),
            storage.getExams(),
            storage.getResults()
        ]);
        setClasses(cls);
        setStudents(std);
        setExams(exm);
        setResults(res);
    } catch (error) {
        console.error("Veri yükleme hatası:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // İlk açılışta verileri yükle
    refreshData();
  }, []);

  // CRUD Wrappers
  const addClass = async (name: string) => {
      await storage.saveClass({ id: generateUUID(), name });
      refreshData();
  };

  const deleteClass = async (id: string) => {
      await storage.deleteClass(id);
      refreshData();
  };
  
  const addStudent = async (name: string, classId: string) => {
      await storage.saveStudent({ id: generateUUID(), name, classId });
      refreshData();
  };

  const deleteStudent = async (id: string) => {
      await storage.deleteStudent(id);
      refreshData();
  };

  const addExam = async (exam: Exam) => {
      await storage.saveExam(exam);
      refreshData();
  };
  
  const deleteExam = async (id: string) => {
    await storage.deleteExam(id);
    refreshData();
  };

  const updateExam = async (updatedExam: Exam) => {
      await storage.saveExam(updatedExam);
      refreshData();
  }

  // Bulk Result Import
  const saveBulkResults = async (newResults: ExamResult[]) => {
      await storage.saveBulkResults(newResults);
      refreshData();
  };

  // Analytics Helpers
  const getStats = () => {
    const tytExams = exams.filter(e => e.type === 'TYT');
    const tytResults = results.filter(r => tytExams.some(e => e.id === r.examId));
    const tytAvg = tytResults.length > 0 
      ? (tytResults.reduce((acc, r) => acc + r.totalNet, 0) / tytResults.length).toFixed(2) 
      : "0.00";

    const aytExams = exams.filter(e => e.type === 'AYT');
    const aytResults = results.filter(r => aytExams.some(e => e.id === r.examId));
    const aytAvg = aytResults.length > 0 
      ? (aytResults.reduce((acc, r) => acc + r.totalNet, 0) / aytResults.length).toFixed(2) 
      : "0.00";

    return {
      tytCount: tytExams.length,
      tytAvg,
      aytCount: aytExams.length,
      aytAvg
    };
  };

  // Dashboard Chart Data Calculation
  const getDashboardData = useMemo(() => {
    // 1. İlgili türdeki sınavları tarihe göre sırala
    const sortedExams = exams
      .filter(e => e.type === dashboardType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedExams.map(exam => {
      const examResults = results.filter(r => r.examId === exam.id);
      
      // Okul Ortalaması
      const schoolAvg = examResults.length 
          ? examResults.reduce((acc, r) => acc + r.totalNet, 0) / examResults.length 
          : 0;

      let dataPoint: any = {
        name: exam.name.length > 20 ? exam.name.substring(0, 20) + '...' : exam.name,
        fullName: exam.name,
        schoolAvg: parseFloat(schoolAvg.toFixed(2))
      };

      // Sınıf Seçili ise
      if (dashboardClassId) {
        const classStudents = students.filter(s => s.classId === dashboardClassId).map(s => s.id);
        const classResults = examResults.filter(r => classStudents.includes(r.studentId));
        
        const classAvg = classResults.length
          ? classResults.reduce((acc, r) => acc + r.totalNet, 0) / classResults.length
          : 0;
        
        dataPoint.classAvg = parseFloat(classAvg.toFixed(2));
      }

      // Öğrenci Seçili ise
      if (dashboardStudentId) {
        const studentResult = examResults.find(r => r.studentId === dashboardStudentId);
        dataPoint.studentNet = studentResult ? studentResult.totalNet : null;
      }

      return dataPoint;
    });
  }, [exams, results, dashboardType, dashboardClassId, dashboardStudentId, students]);

  // Handle Class Change -> Reset Student Selection if not in class
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clsId = e.target.value;
    setDashboardClassId(clsId);
    setDashboardStudentId(''); // Reset student when class changes
  };

  const handleAIAnalysis = async () => {
    if (!selectedStudentForAnalysis) return;
    
    setAiModalOpen(true);
    setAiStatus(AnalysisStatus.LOADING);
    
    const student = students.find(s => s.id === selectedStudentForAnalysis);
    const studentResults = results.filter(r => r.studentId === selectedStudentForAnalysis);

    try {
      const analysis = await analyzeStudentPerformance(student?.name || 'Öğrenci', studentResults, exams);
      setAiContent(analysis);
      setAiStatus(AnalysisStatus.SUCCESS);
    } catch (e: any) {
      setAiContent(e.message || 'Beklenmedik bir hata oluştu.');
      setAiStatus(AnalysisStatus.ERROR);
    }
  };

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p>Veritabanı Yükleniyor...</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'dashboard':
        const stats = getStats();
        // Filtered students for dropdown
        const filteredDashboardStudents = dashboardClassId 
          ? students.filter(s => s.classId === dashboardClassId) 
          : students;

        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Üst İstatistik Alanı */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Genel */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between gap-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Users className="w-5 h-5 text-blue-600"/> Okul Geneli
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium">Toplam Öğrenci</p>
                      <p className="text-2xl font-bold text-slate-800">{students.length}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium">Toplam Sınıf</p>
                      <p className="text-2xl font-bold text-slate-800">{classes.length}</p>
                   </div>
                </div>
              </div>

              {/* TYT */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <BookOpen className="w-32 h-32" />
                </div>
                <h3 className="font-bold text-orange-700 flex items-center gap-2 relative z-10">
                   <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-sm">TYT</span> Performansı
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                      <p className="text-xs text-slate-500 font-medium">Uygulanan Sınav</p>
                      <p className="text-2xl font-bold text-orange-700">{stats.tytCount}</p>
                   </div>
                   <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                      <p className="text-xs text-slate-500 font-medium">Genel Net Ort.</p>
                      <p className="text-2xl font-bold text-orange-700">{stats.tytAvg}</p>
                   </div>
                </div>
              </div>

              {/* AYT */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <BarChart3 className="w-32 h-32" />
                </div>
                <h3 className="font-bold text-purple-700 flex items-center gap-2 relative z-10">
                   <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">AYT</span> Performansı
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <p className="text-xs text-slate-500 font-medium">Uygulanan Sınav</p>
                      <p className="text-2xl font-bold text-purple-700">{stats.aytCount}</p>
                   </div>
                   <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <p className="text-xs text-slate-500 font-medium">Genel Net Ort.</p>
                      <p className="text-2xl font-bold text-purple-700">{stats.aytAvg}</p>
                   </div>
                </div>
              </div>

            </div>

            {/* Filtreleme ve Grafik */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Performans Analiz Grafiği</h3>
                    <p className="text-sm text-slate-500">
                        {dashboardStudentId ? 'Öğrenci, Sınıf ve Okul Karşılaştırması' : 
                         dashboardClassId ? 'Sınıf ve Okul Ortalaması Karşılaştırması' : 
                         'Genel Okul Ortalaması Trendi'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* TYT/AYT Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                        onClick={() => setDashboardType('TYT')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${dashboardType === 'TYT' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                        TYT
                        </button>
                        <button 
                        onClick={() => setDashboardType('AYT')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${dashboardType === 'AYT' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                        AYT
                        </button>
                    </div>

                    {/* Sınıf Filtresi */}
                    <div className="relative">
                        <select
                            value={dashboardClassId}
                            onChange={handleClassChange}
                            className="pl-3 pr-8 py-2 text-sm border-slate-200 bg-slate-50 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                            <option value="">Tüm Okul (Genel)</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Öğrenci Filtresi */}
                    <div className="relative">
                        <select
                            value={dashboardStudentId}
                            onChange={(e) => setDashboardStudentId(e.target.value)}
                            disabled={!dashboardClassId && students.length > 50} 
                            className="pl-3 pr-8 py-2 text-sm border-slate-200 bg-slate-50 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none disabled:opacity-50"
                        >
                            <option value="">Öğrenci Seçiniz...</option>
                            {filteredDashboardStudents.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getDashboardData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12}} 
                        dy={10} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12}} 
                        domain={[0, 'auto']}
                    />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                      labelStyle={{color: '#1e293b', fontWeight: 'bold', marginBottom: '4px'}}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    
                    {/* Okul Ortalaması */}
                    <Line 
                        type="monotone" 
                        dataKey="schoolAvg" 
                        name="Okul Ort." 
                        stroke="#94a3b8" 
                        strokeWidth={2} 
                        dot={{r: 4}} 
                        activeDot={{r: 6}}
                        strokeDasharray="5 5"
                    />

                    {/* Sınıf Ortalaması */}
                    {dashboardClassId && (
                        <Line 
                            type="monotone" 
                            dataKey="classAvg" 
                            name="Sınıf Ort." 
                            stroke="#8b5cf6" 
                            strokeWidth={3} 
                            dot={{r: 4}} 
                            activeDot={{r: 6}}
                        />
                    )}

                    {/* Öğrenci Neti */}
                    {dashboardStudentId && (
                        <Bar 
                            dataKey="studentNet" 
                            name="Öğrenci Neti" 
                            fill={dashboardType === 'TYT' ? '#f97316' : '#8b5cf6'}
                            radius={[6, 6, 0, 0]} 
                            barSize={40}
                        />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
            </div>
          </div>
        );
      case 'students':
        return (
          <StudentManager 
            classes={classes} 
            students={students} 
            onAddClass={addClass} 
            onDeleteClass={deleteClass}
            onAddStudent={addStudent}
            onDeleteStudent={deleteStudent}
          />
        );
      case 'exams':
        return (
          <ExamManager 
            exams={exams}
            classes={classes}
            students={students}
            results={results}
            onAddExam={addExam}
            onDeleteExam={deleteExam}
            onSaveBulkResults={saveBulkResults}
            onUpdateExam={updateExam}
          />
        );
      case 'rankings':
        return (
            <ExamAnalysis 
                exams={exams}
                results={results}
                students={students}
                classes={classes}
            />
        );
      case 'analysis':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-in fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Sparkles className="text-indigo-600" /> Bireysel Öğrenci Analizi (AI)
            </h2>
            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-indigo-800 text-sm">
                  Yapay zeka asistanı, öğrencinin tüm sınav sonuçlarını analiz ederek güçlü/zayıf yönlerini belirler ve kişiselleştirilmiş çalışma programı önerir.
                </p>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Öğrenci Seçimi</label>
                  <select 
                    value={selectedStudentForAnalysis}
                    onChange={e => setSelectedStudentForAnalysis(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  >
                    <option value="">Listeden bir öğrenci seçin...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({classes.find(c=>c.id === s.classId)?.name})</option>
                    ))}
                  </select>
              </div>

              <button 
                disabled={!selectedStudentForAnalysis}
                onClick={handleAIAnalysis}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
              >
                Analiz Raporunu Oluştur
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              NetOkul
            </h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
            { id: 'students', icon: Users, label: 'Sınıflar & Öğrenciler' },
            { id: 'exams', icon: FileText, label: 'Sınavlar & Sonuçlar' },
            { id: 'rankings', icon: BarChart3, label: 'Sınav Analizleri' },
            { id: 'analysis', icon: Sparkles, label: 'AI Koç' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 font-medium' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <AIAnalysisModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        status={aiStatus}
        content={aiContent}
      />
    </div>
  );
}

export default App;
