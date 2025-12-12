// @ts-nocheck
import { Student, ClassGroup, Exam, ExamResult } from './types';

// Vite/Build ortamında 'dexie' modülü bulunamadı hatasını aşmak için
// Dexie'yi index.html'de script olarak yükleyip window objesinden alıyoruz.
const Dexie = (window as any).Dexie;

export class NetOkulDatabase extends Dexie {
  students;
  classes;
  exams;
  results;

  constructor() {
    super('NetOkulDB');
    
    // Veritabanı şeması
    // Anahtarlar (Primary Key) ve indekslenecek alanları belirtiyoruz
    this.version(1).stores({
      classes: 'id, name',
      students: 'id, classId, name',
      exams: 'id, type, date',
      results: 'id, examId, studentId, [examId+studentId]' // Compound index for fast lookups
    });
    
    // Tablo arayüzlerini Dexie özelliklerine bağla
    this.students = this.table('students');
    this.classes = this.table('classes');
    this.exams = this.table('exams');
    this.results = this.table('results');
  }
}

export const db = new NetOkulDatabase();