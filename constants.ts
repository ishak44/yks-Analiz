
import { ClassGroup, Student, Exam, ExamResult, SubjectConfig, ExamType } from './types';

// JSON key'leri eklendi (tr, sos, mat, fen)
export const TYT_SUBJECTS: SubjectConfig[] = [
  { name: 'Türkçe', questionCount: 40, jsonKey: 'tr' },
  { name: 'Sosyal Bilimler', questionCount: 20, jsonKey: 'sos' },
  { name: 'Temel Matematik', questionCount: 40, jsonKey: 'mat' },
  { name: 'Fen Bilimleri', questionCount: 20, jsonKey: 'fen' }
];

// AYT için tahmini JSON keyleri
export const AYT_SUBJECTS: SubjectConfig[] = [
  { name: 'Matematik', questionCount: 40, jsonKey: 'mat' },
  { name: 'Fen Bilimleri', questionCount: 40, jsonKey: 'fen' },
  { name: 'Türk Dili ve Ed.', questionCount: 24, jsonKey: 'edb' },
  { name: 'Sosyal Bilimler-1', questionCount: 10, jsonKey: 'sos1' },
  { name: 'Sosyal Bilimler-2', questionCount: 46, jsonKey: 'sos2' }
];

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { name: 'Sözel Bölüm', questionCount: 50 },
  { name: 'Sayısal Bölüm', questionCount: 50 }
];

export const MOCK_CLASSES: ClassGroup[] = [
  { id: 'c-12a', name: '12-A' },
  { id: 'c-12b', name: '12-B' },
  { id: 'c-12c', name: '12-C' },
  { id: 'c-12d', name: '12-D' }
];

export const MOCK_STUDENTS: Student[] = [
  // 12-A
  { id: '800', name: 'KEVSER TAPİK', classId: 'c-12a' },
  { id: '932', name: 'RUMEYSA KAPLAN', classId: 'c-12a' },
  { id: '967', name: 'MEHMET HARUN AKINCI', classId: 'c-12a' },
  { id: '973', name: 'ECRİN NİSA ÖZBAY', classId: 'c-12a' },
  { id: '998', name: 'SENA NUR YILDIZ', classId: 'c-12a' },
  { id: '1012', name: 'TALHA KAAN ÇETİNKAYA', classId: 'c-12a' },
  { id: '1102', name: 'ABDULVAHAP AKDAĞ', classId: 'c-12a' },
  { id: '1114', name: 'BAHADIR ÖZDEMİR', classId: 'c-12a' },
  { id: '1115', name: 'SEMİH DOĞAN', classId: 'c-12a' },
  { id: '1121', name: 'ALİ OSMAN GÖKÇE', classId: 'c-12a' },
  { id: '1123', name: 'MUSTAFA EMİR KASAPOĞLU', classId: 'c-12a' },
  { id: '1124', name: 'ELİF ALTAŞ', classId: 'c-12a' },
  { id: '1129', name: 'İREM TÜRKOĞLU', classId: 'c-12a' },
  { id: '1133', name: 'EMİRHAN KÜLLÜ', classId: 'c-12a' },
  { id: '1140', name: 'CİHAN KESKİN', classId: 'c-12a' },
  { id: '1238', name: 'MÜZEYYEN BETÜL DELİCE', classId: 'c-12a' },
  
  // 12-B
  { id: '907', name: 'HATİCE NUR ÖZCAN', classId: 'c-12b' },
  { id: '920', name: 'MELİHA MÜNİBE PEKER', classId: 'c-12b' },
  { id: '926', name: 'BAYRAM BORAN', classId: 'c-12b' },
  { id: '960', name: 'HİRANUR EKEMEN', classId: 'c-12b' },
  { id: '992', name: 'TALHA KALKANCI', classId: 'c-12b' },
  { id: '1011', name: 'ECRİN ECEM UZUN', classId: 'c-12b' },
  { id: '1113', name: 'ÖMER FARUK KARAKUŞ', classId: 'c-12b' },
  { id: '1142', name: 'AYŞE MEDİNE UÇKUN', classId: 'c-12b' },
  { id: '1143', name: 'BERAT ALTAY', classId: 'c-12b' },
  { id: '1144', name: 'YUSUF KAĞAN BAYIR', classId: 'c-12b' },
  { id: '1146', name: 'MEHMET ALİ CERİTLİ', classId: 'c-12b' },
  { id: '1161', name: 'MUHAMMED MUSTAFA GÜLMEZ', classId: 'c-12b' },
  { id: '1168', name: 'MEHMET EGE DAL', classId: 'c-12b' },
  { id: '1169', name: 'MERYEM EDA DOĞAN', classId: 'c-12b' },
  { id: '1171', name: 'ABDULLAH MELİH DEDEOĞLU', classId: 'c-12b' },
  { id: '1182', name: 'SERHAT YILDIZ', classId: 'c-12b' },

  // 12-C
  { id: '930', name: 'EMİRHAN CEBE', classId: 'c-12c' },
  { id: '1022', name: 'DOĞAN MERT GÜDE', classId: 'c-12c' },
  { id: '1119', name: 'EYMEN GANİ ÇETİN', classId: 'c-12c' },
  { id: '1173', name: 'HİRANUR BAL', classId: 'c-12c' },
  { id: '1176', name: 'YUSUF İKİNCİ', classId: 'c-12c' },
  { id: '1178', name: 'EMRE GÜRLEK', classId: 'c-12c' },
  { id: '1179', name: 'ZEHRA SAĞIN', classId: 'c-12c' },
  { id: '1183', name: 'MUHAMMED EMİR ÖNAL', classId: 'c-12c' },
  { id: '1185', name: 'ELİF AZRA GÜL', classId: 'c-12c' },
  { id: '1186', name: 'ENES DORUK', classId: 'c-12c' },
  { id: '1187', name: 'VEHBİ SARIOĞLU', classId: 'c-12c' },
  { id: '1189', name: 'HATİCE KÜBRA AKBIYIK', classId: 'c-12c' },
  { id: '1190', name: 'MUHAMMED BODRUK', classId: 'c-12c' },
  { id: '1192', name: 'HASAN CAN KUL', classId: 'c-12c' },
  { id: '1195', name: 'EBUBEKİR GÜDEN', classId: 'c-12c' },
  { id: '1196', name: 'AYŞE FATMA SARI', classId: 'c-12c' },
  { id: '1197', name: 'ÖZGE KOÇ', classId: 'c-12c' },
  { id: '1199', name: 'YAĞMUR POLA', classId: 'c-12c' },
  { id: '1200', name: 'DÖNE AZRA KARABURUN', classId: 'c-12c' },
  { id: '1201', name: 'SEFA İŞCAN', classId: 'c-12c' },
  { id: '1213', name: 'İBRAHİM BAKIR', classId: 'c-12c' },
  { id: '1225', name: 'EBUBEKİR ARĞALI', classId: 'c-12c' },
  { id: '1230', name: 'ENES ÖZBEK', classId: 'c-12c' },
  { id: '1241', name: 'BERAT KAAN ÇETİN', classId: 'c-12c' },

  // 12-D
  { id: '603', name: 'FURKAN AYHAN', classId: 'c-12d' },
  { id: '801', name: 'AHMET TAHA ARDUÇ', classId: 'c-12d' },
  { id: '802', name: 'ELİF HAVVA ERTUĞRUL', classId: 'c-12d' },
  { id: '1094', name: 'İBRAHİM IŞIK', classId: 'c-12d' },
  { id: '1112', name: 'BERKAY ALTINTAŞ', classId: 'c-12d' },
  { id: '1170', name: 'AHMET BERAT DENİZCİ', classId: 'c-12d' },
  { id: '1205', name: 'AZİZ ENES YILMAZ', classId: 'c-12d' },
  { id: '1206', name: 'HAKAN CAN ÖZKAN', classId: 'c-12d' },
  { id: '1207', name: 'BURAK AKIN TOPAL', classId: 'c-12d' },
  { id: '1208', name: 'MURAT EMRE ÖZHAN', classId: 'c-12d' },
  { id: '1211', name: 'MUSTAFA İSMAİL ŞİMŞEK', classId: 'c-12d' },
  { id: '1212', name: 'MELEK İKRA GÜMÜŞ', classId: 'c-12d' },
  { id: '1214', name: 'ECRİN KORKMAZ', classId: 'c-12d' },
  { id: '1215', name: 'İLKER KAAN BAYDAR', classId: 'c-12d' },
  { id: '1217', name: 'MAHMUT ERAY ERDAL', classId: 'c-12d' },
  { id: '1220', name: 'NURBANU DOĞANŞAHİN', classId: 'c-12d' },
  { id: '1224', name: 'MİRAÇ ÖZTÜRK', classId: 'c-12d' },
  { id: '1227', name: 'İSMAİL AYIK', classId: 'c-12d' },
  { id: '1231', name: 'BERAY ÖZKANCA', classId: 'c-12d' },
  { id: '1235', name: 'NEBAHAT ECRİN KALOĞLU', classId: 'c-12d' }
];

export const MOCK_EXAMS: Exam[] = [];

export const MOCK_RESULTS: ExamResult[] = [];
