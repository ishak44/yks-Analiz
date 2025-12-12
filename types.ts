
export type ExamType = 'TYT' | 'AYT' | 'DIGER';

export interface Student {
  id: string;
  name: string;
  classId: string;
}

export interface ClassGroup {
  id: string;
  name: string;
}

export interface SubjectConfig {
  name: string;
  questionCount: number;
  jsonKey?: string; // JSON'dan eşleştirme için anahtar (tr, mat, sos vb.)
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  date: string;
  subjects: SubjectConfig[];
  pdfName?: string; 
}

export interface SubjectResult {
  correct: number;
  incorrect: number;
  net: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  results: { [subjectName: string]: SubjectResult };
  totalNet: number;
}

export interface ExtractedStudentResult {
  studentName: string;
  className: string;
  scores: {
    [subjectName: string]: {
      correct: number;
      incorrect: number;
    }
  }
}

// JSON Import Yapısı - Güncellendi
export interface ImportedExamData {
  exam_id: string; // "4K TYT 1.SAYI(25-26)"
  student_name: string;
  class_name: string;
  rank: number;
  net_total: number;
  details: {
    [key: string]: number; // "tr": 24, "sos": 10.5
  }
}

export enum AnalysisStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
