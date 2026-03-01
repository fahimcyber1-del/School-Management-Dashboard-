
// Mock data service to share data across components
export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  group: string;
  roll: number;
  phone: string;
  photo: string | null;
  // Enhanced fields
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  guardianEmail?: string;
  previousSchool: string;
  lastYearGPA: string;
  lastYearGrade: string;
  academicHistory: string; // Textual summary or comma separated list
}

export interface ClassInfo {
  id: string;
  name: string;
  level: string;
  sections: string[];
  subjects: string[];
}

export interface Exam {
  id: string;
  name: string;
  class: string;
  status: string;
  date: string;
}

export interface AttendanceRecord {
  date: string;
  present: number;
  total: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  marks: Record<string, number>; // subject -> marks
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  amount: number;
  type: string;
  date: string;
  status: 'Paid' | 'Due';
  invoiceNo: string;
  month: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Exam' | 'Event' | 'Holiday';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  subjects: string[];
  phone: string;
  email: string;
  nid: string;
  joiningDate: string;
  qualification: string;
  experience: string;
  address: string;
  assignedClasses: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
  photo: string | null;
  academicHistory: string[];
  certifications: string[];
  workHistory: string[];
}

export const initialStudents: Student[] = [
  {
    id: 'ST1001', name: 'Rahim Uddin', class: 'Class 9', section: 'A', group: 'Science', roll: 1, phone: '01711000000', photo: null,
    fatherName: 'Abdur Rahim', motherName: 'Rahima Begum', guardianPhone: '01711000000', previousSchool: 'Ideal School',
    lastYearGPA: '5.00', lastYearGrade: 'A+', academicHistory: 'Class 8 (Ideal School), Class 7 (Ideal School)'
  },
  {
    id: 'ST1002', name: 'Karim Hasan', class: 'Class 9', section: 'A', group: 'Science', roll: 2, phone: '01711000001', photo: null,
    fatherName: 'Hasan Ali', motherName: 'Karima Khatun', guardianPhone: '01711000001', previousSchool: 'Zilla School',
    lastYearGPA: '4.85', lastYearGrade: 'A', academicHistory: 'Class 8 (Zilla School)'
  },
  {
    id: 'ST1003', name: 'Ayesha Siddiqua', class: 'Class 10', section: 'B', group: 'Humanities', roll: 15, phone: '01711000002', photo: null,
    fatherName: 'Siddiqur Rahman', motherName: 'Ayesha Begum', guardianPhone: '01711000002', previousSchool: 'Girls High School',
    lastYearGPA: '5.00', lastYearGrade: 'A+', academicHistory: 'Class 9 (Girls High School)'
  },
  {
    id: 'ST1004', name: 'Fatima Begum', class: 'Class 8', section: 'C', group: 'N/A', roll: 42, phone: '01711000003', photo: null,
    fatherName: 'Anwar Hossain', motherName: 'Fatima Khatun', guardianPhone: '01711000003', previousSchool: 'Model School',
    lastYearGPA: '4.50', lastYearGrade: 'A', academicHistory: 'Class 7 (Model School)'
  },
  {
    id: 'ST1005', name: 'Jalal Ahmed', class: 'Class 6', section: 'A', group: 'N/A', roll: 5, phone: '01711000004', photo: null,
    fatherName: 'Ahmed Ali', motherName: 'Jalala Begum', guardianPhone: '01711000004', previousSchool: 'Primary School',
    lastYearGPA: '5.00', lastYearGrade: 'A+', academicHistory: 'Class 5 (Primary School)'
  },
  {
    id: 'ST1006', name: 'Nusrat Jahan', class: 'Class 7', section: 'B', group: 'N/A', roll: 12, phone: '01711000005', photo: null,
    fatherName: 'Jahan Ali', motherName: 'Nusrata Begum', guardianPhone: '01711000005', previousSchool: 'City School',
    lastYearGPA: '4.70', lastYearGrade: 'A', academicHistory: 'Class 6 (City School)'
  },
  {
    id: 'ST1007', name: 'Tanvir Hossain', class: 'Class 9', section: 'A', group: 'Science', roll: 3, phone: '01711000006', photo: null,
    fatherName: 'Hossain Ali', motherName: 'Tanvira Begum', guardianPhone: '01711000006', previousSchool: 'Public School',
    lastYearGPA: '4.90', lastYearGrade: 'A', academicHistory: 'Class 8 (Public School)'
  },
  {
    id: 'ST1008', name: 'Sumaiya Akter', class: 'Class 10', section: 'A', group: 'Business Studies', roll: 1, phone: '01711000007', photo: null,
    fatherName: 'Akter Ali', motherName: 'Sumaiya Begum', guardianPhone: '01711000007', previousSchool: 'Central School',
    lastYearGPA: '5.00', lastYearGrade: 'A+', academicHistory: 'Class 9 (Central School)'
  },
  {
    id: 'ST1009', name: 'Arifur Rahman', class: 'Class 9', section: 'B', group: 'Commerce', roll: 22, phone: '01711000008', photo: null,
    fatherName: 'Rahman Ali', motherName: 'Arifura Begum', guardianPhone: '01711000008', previousSchool: 'Town School',
    lastYearGPA: '4.60', lastYearGrade: 'A-', academicHistory: 'Class 8 (Town School)'
  },
  {
    id: 'ST1010', name: 'Sadia Islam', class: 'Class 8', section: 'A', group: 'N/A', roll: 7, phone: '01711000009', photo: null,
    fatherName: 'Islam Ali', motherName: 'Sadia Begum', guardianPhone: '01711000009', previousSchool: 'Village School',
    lastYearGPA: '4.80', lastYearGrade: 'A', academicHistory: 'Class 7 (Village School)'
  },
];

export const initialClasses: ClassInfo[] = [
  { id: 'C1', name: 'Play', level: 'Pre-Primary', sections: ['A', 'B'], subjects: ['Bangla', 'English', 'Math', 'Drawing'] },
  { id: 'C2', name: 'KG', level: 'Pre-Primary', sections: ['A'], subjects: ['Bangla', 'English', 'Math', 'General Knowledge'] },
  { id: 'C3', name: 'Class 1', level: 'Primary', sections: ['A', 'B', 'C'], subjects: ['Bangla', 'English', 'Math', 'Religion', 'General Knowledge'] },
  { id: 'C4', name: 'Class 2', level: 'Primary', sections: ['A', 'B'], subjects: ['Bangla', 'English', 'Math', 'Religion', 'General Knowledge'] },
  { id: 'C5', name: 'Class 5', level: 'Primary', sections: ['A', 'B'], subjects: ['Bangla', 'English', 'Math', 'Science', 'BGS', 'Religion'] },
  { id: 'C6', name: 'Class 6', level: 'Secondary', sections: ['A', 'B'], subjects: ['Bangla', 'English', 'Math', 'Science', 'BGS', 'Religion', 'ICT'] },
  { id: 'C7', name: 'Class 8', level: 'Secondary', sections: ['A', 'B'], subjects: ['Bangla', 'English', 'Math', 'Science', 'BGS', 'Religion', 'ICT'] },
  { id: 'C8', name: 'Class 9 (Science)', level: 'Secondary', sections: ['A'], subjects: ['Bangla', 'English', 'Math', 'Physics', 'Chemistry', 'Biology', 'ICT'] },
  { id: 'C9', name: 'Class 9 (Commerce)', level: 'Secondary', sections: ['B'], subjects: ['Bangla', 'English', 'Math', 'Accounting', 'Business Ent.', 'Finance', 'ICT'] },
  { id: 'C10', name: 'Class 10 (Science)', level: 'Secondary', sections: ['A'], subjects: ['Bangla', 'English', 'Math', 'Physics', 'Chemistry', 'Biology', 'ICT'] },
];

export const initialTeachers: Teacher[] = [
  {
    id: 'TR1001', name: 'Md. Abdul Karim', designation: 'Head Teacher', subjects: ['Bangla'], phone: '01812000001', email: 'karim@school.edu.bd',
    nid: '1990123456789', joiningDate: '2005-01-15', qualification: 'M.A in Bangla Literature', experience: '20', address: 'House 12, Road 5, Dhanmondi, Dhaka',
    assignedClasses: ['Class 9', 'Class 10'], status: 'Active', photo: null,
    academicHistory: ['M.A in Bangla, Dhaka University (2002)', 'B.A in Bangla, Dhaka University (2000)'],
    certifications: ['Advanced Educational Management', 'National Curriculum Trainer'],
    workHistory: ['Senior Teacher at Zilla School (2005-2015)', 'Assistant Teacher at Govt High School (2002-2005)']
  },
  {
    id: 'TR1002', name: 'Shahana Pervin', designation: 'Senior Teacher', subjects: ['English'], phone: '01712000002', email: 'shahana.p@school.edu.bd',
    nid: '1992234567890', joiningDate: '2010-06-01', qualification: 'M.A in English', experience: '15', address: 'Mirpur-10, Dhaka',
    assignedClasses: ['Class 8', 'Class 9', 'Class 10'], status: 'Active', photo: null,
    academicHistory: ['M.A in English, Jahangirnagar University (2008)', 'B.A in English, BRAC University (2006)'],
    certifications: ['TESOL Certification', 'Digital Literacy for Educators'],
    workHistory: ['English Teacher at Ideal School (2010-2020)', 'Language Instructor at British Council (2008-2010)']
  },
  {
    id: 'TR1003', name: 'Dr. Rafiqul Islam', designation: 'Senior Teacher', subjects: ['Physics'], phone: '01912000003', email: 'rafiq.islam@school.edu.bd',
    nid: '1988345678901', joiningDate: '2008-03-10', qualification: 'Ph.D in Physics', experience: '17', address: 'Uttara Sector 7, Dhaka',
    assignedClasses: ['Class 9', 'Class 10'], status: 'Active', photo: null,
    academicHistory: ['Ph.D in Physics, BUET (2012)', 'M.Sc in Applied Physics, Rajshahi University (2006)'],
    certifications: ['STEM Education Leadership', 'Research Methodology Certification'],
    workHistory: ['Assistant Professor at Notre Dame College (2012-2022)', 'Physics Lecturer at Science College (2008-2012)']
  },
  {
    id: 'TR1004', name: 'Fatema Akhter', designation: 'Assistant Teacher', subjects: ['Math'], phone: '01612000004', email: 'fatema.a@school.edu.bd',
    nid: '1995456789012', joiningDate: '2015-07-20', qualification: 'M.Sc in Mathematics', experience: '10', address: 'Mohammadpur, Dhaka',
    assignedClasses: ['Class 6', 'Class 7', 'Class 8'], status: 'Active', photo: null,
    academicHistory: ['M.Sc in Applied Mathematics, Dhaka University (2014)', 'B.Sc in Mathematics (Honors), DU (2012)'],
    certifications: ['Mathematical Olympiad Coach', 'Primary Pedagogy Diploma'],
    workHistory: ['Math Teacher at Model High School (2015-2022)']
  },
  {
    id: 'TR1005', name: 'Aminul Haque', designation: 'Assistant Teacher', subjects: ['Chemistry'], phone: '01512000005', email: 'aminul.h@school.edu.bd',
    nid: '1993567890123', joiningDate: '2018-01-05', qualification: 'M.Sc in Chemistry', experience: '7', address: 'Banani, Dhaka',
    assignedClasses: ['Class 9', 'Class 10'], status: 'On Leave', photo: null,
    academicHistory: ['M.Sc in Chemistry, Jagannath University (2016)', 'B.Sc in Chemistry, RU (2014)'],
    certifications: ['Laboratory Safety Professional', 'Creative Question Setter Training'],
    workHistory: ['Chemistry Teacher at City College (2018-2023)']
  },
  {
    id: 'TR1006', name: 'Nasreen Sultana', designation: 'Assistant Teacher', subjects: ['Biology'], phone: '01312000006', email: 'nasreen.s@school.edu.bd',
    nid: '1996678901234', joiningDate: '2019-06-15', qualification: 'M.Sc in Zoology', experience: '6', address: 'Gulshan-2, Dhaka',
    assignedClasses: ['Class 9', 'Class 10'], status: 'Active', photo: null,
    academicHistory: ['M.Sc in Zoology, Chittagong University (2018)', 'B.Sc in Biology, CU (2016)'],
    certifications: ['Biological Specimen Preparation Certificate', 'Classroom Management Masterclass'],
    workHistory: ['Biology Teacher at Cantonment Public School (2019-2024)']
  },
  {
    id: 'TR1007', name: 'Md. Rezaul Karim', designation: 'Junior Teacher', subjects: ['ICT'], phone: '01412000007', email: 'rezaul.k@school.edu.bd',
    nid: '1998789012345', joiningDate: '2021-02-01', qualification: 'B.Sc in CSE', experience: '4', address: 'Bashundhara R/A, Dhaka',
    assignedClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9'], status: 'Active', photo: null,
    academicHistory: ['B.Sc in CSE, North South University (2020)'],
    certifications: ['CompTIA A+', 'Certified Ethical Hacker (CEH)'],
    workHistory: ['Systems Admin at Tech Solutions (2020-2021)', 'ICT Instructor at NIIT (2021-2022)']
  },
  {
    id: 'TR1008', name: 'Salma Begum', designation: 'Part-Time Teacher', subjects: ['Religion'], phone: '01112000008', email: 'salma.b@school.edu.bd',
    nid: '1991890123456', joiningDate: '2022-08-10', qualification: 'Kamil (Islamic Studies)', experience: '3', address: 'Jatrabari, Dhaka',
    assignedClasses: ['Class 6', 'Class 7'], status: 'Active', photo: null,
    academicHistory: ['Kamil (Islamic Studies), Alia Madrasah (2020)', 'Fazil, Madrasah Board (2018)'],
    certifications: ['Quranic Phonetics Expert'],
    workHistory: ['Religious Instructor at Local Mosque (2020-2022)']
  },
];

export const initialExams: Exam[] = [
  { id: 'EX1', name: 'Half Yearly Exam 2023', class: 'Class 9', status: 'Completed', date: '2023-06-15' },
  { id: 'EX2', name: 'Class Test 1', class: 'Class 10', status: 'Completed', date: '2023-08-10' },
  { id: 'EX3', name: 'Final Exam 2023', class: 'Class 8', status: 'Upcoming', date: '2023-11-20' },
  { id: 'EX4', name: 'Test Exam', class: 'Class 10', status: 'Ongoing', date: '2023-10-15' },
];

export const initialAnnouncements: Announcement[] = [
  { id: 'AN-1', title: 'Eid-ul-Fitr Holidays', content: 'The school will remain closed from March 20 to March 25 for Eid-ul-Fitr holidays.', category: 'Holiday', priority: 'High', date: '2025-03-10' },
  { id: 'AN-2', title: 'Parent-Teacher Meeting', content: 'Meeting for Class 9 and 10 will be held on April 5 at the auditorium.', category: 'Event', priority: 'Medium', date: '2025-03-28' },
  { id: 'AN-3', title: 'Final Exam Schedule', content: 'The final exam for the first semester will commence on May 15.', category: 'Exam', priority: 'High', date: '2025-04-15' },
  { id: 'AN-4', title: 'New Sports Equipment Arrival', content: 'We are pleased to announce the arrival of new sports gear for the gymnasium.', category: 'General', priority: 'Low', date: '2025-03-20' },
];

// Simple singleton to manage state in memory for the demo
class DataStore {
  private students: Student[] = [...initialStudents];
  private classes: ClassInfo[] = [...initialClasses];
  private exams: Exam[] = [...initialExams];
  private teachers: Teacher[] = [...initialTeachers];
  private announcements: Announcement[] = [...initialAnnouncements];
  private attendance: AttendanceRecord[] = [
    { date: new Date().toISOString().split('T')[0], present: 8, total: 10 }
  ];
  // ... (keep dailyAttendance as is)

  getAnnouncements() {
    return this.announcements.sort((a, b) => b.date.localeCompare(a.date));
  }
  private dailyAttendance: Record<string, Record<string, 'present' | 'absent' | 'late'>> = {};

  constructor() {
    // Seed some mock attendance for the last 30 days
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      const dayOfWeek = d.getDay();
      if (dayOfWeek === 5) continue; // Skip Fridays (weekend in Bangladesh)

      const dayRecords: Record<string, 'present' | 'absent' | 'late'> = {};
      initialStudents.forEach(student => {
        // Randomly assign status with weights
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late' = 'present';
        if (rand > 0.95) status = 'absent';
        else if (rand > 0.85) status = 'late';
        dayRecords[student.id] = status;
      });
      this.dailyAttendance[dateKey] = dayRecords;

      // Also update the summary list used for dashboard
      const presentCount = Object.values(dayRecords).filter(s => s === 'present' || s === 'late').length;
      this.attendance.push({ date: dateKey, present: presentCount, total: initialStudents.length });
    }
  }
  private examResults: ExamResult[] = [];
  private feeTransactions: FeeTransaction[] = [
    { id: 'TXN-001', studentId: 'ST1001', studentName: 'Rahim Uddin', studentClass: 'Class 9', studentSection: 'A', amount: 2500, type: 'Tuition', status: 'Paid', date: '2025-01-05', invoiceNo: 'F001', month: 'January' },
    { id: 'TXN-002', studentId: 'ST1002', studentName: 'Karim Hasan', studentClass: 'Class 9', studentSection: 'A', amount: 2500, type: 'Tuition', status: 'Paid', date: '2025-01-03', invoiceNo: 'F002', month: 'January' },
    { id: 'TXN-003', studentId: 'ST1003', studentName: 'Ayesha Siddiqua', studentClass: 'Class 10', studentSection: 'B', amount: 2800, type: 'Tuition', status: 'Due', date: '', invoiceNo: 'F003', month: 'January' },
    { id: 'TXN-004', studentId: 'ST1004', studentName: 'Fatima Begum', studentClass: 'Class 8', studentSection: 'C', amount: 2000, type: 'Tuition', status: 'Paid', date: '2025-01-10', invoiceNo: 'F004', month: 'January' },
    { id: 'TXN-005', studentId: 'ST1005', studentName: 'Jalal Ahmed', studentClass: 'Class 6', studentSection: 'A', amount: 1500, type: 'Tuition', status: 'Due', date: '', invoiceNo: 'F005', month: 'January' },
    { id: 'TXN-006', studentId: 'ST1001', studentName: 'Rahim Uddin', studentClass: 'Class 9', studentSection: 'A', amount: 3000, type: 'Tuition', status: 'Due', date: '', invoiceNo: 'F006', month: 'February' },
  ];

  getStudents() { return this.students; }
  setStudents(students: Student[]) { this.students = students; }

  addStudent(student: Omit<Student, 'id'>) {
    const newStudent = {
      ...student,
      id: `ST${1000 + this.students.length + 1}`
    };
    this.students.unshift(newStudent);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>) {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...updates };
      return this.students[index];
    }
    return null;
  }

  getClasses() { return this.classes; }
  setClasses(classes: ClassInfo[]) { this.classes = classes; }

  addClass(cls: Omit<ClassInfo, 'id'>) {
    const newClass = {
      ...cls,
      id: `C${this.classes.length + 1}`
    };
    this.classes.push(newClass);
    return newClass;
  }

  updateClass(id: string, updates: Partial<ClassInfo>) {
    const index = this.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.classes[index] = { ...this.classes[index], ...updates };
      return this.classes[index];
    }
    return null;
  }

  deleteClass(id: string) {
    this.classes = this.classes.filter(c => c.id !== id);
  }

  getExams() { return this.exams; }
  setExams(exams: Exam[]) { this.exams = exams; }

  addExam(exam: Omit<Exam, 'id'>) {
    const newExam = {
      ...exam,
      id: `EX${this.exams.length + 1}`
    };
    this.exams.unshift(newExam);
    return newExam;
  }

  updateExam(id: string, updates: Partial<Exam>) {
    const index = this.exams.findIndex(e => e.id === id);
    if (index !== -1) {
      this.exams[index] = { ...this.exams[index], ...updates };
      return this.exams[index];
    }
    return null;
  }

  deleteExam(id: string) {
    this.exams = this.exams.filter(e => e.id !== id);
  }

  getAttendance() { return this.attendance; }
  setAttendance(attendance: AttendanceRecord[]) { this.attendance = attendance; }

  saveDailyAttendance(date: string, records: Record<string, 'present' | 'absent' | 'late'>) {
    this.dailyAttendance[date] = records;

    // Update summary for the dashboard
    const presentCount = Object.values(records).filter(status => status === 'present' || status === 'late').length;
    const totalCount = Object.keys(records).length;

    const existingIndex = this.attendance.findIndex(a => a.date === date);
    if (existingIndex >= 0) {
      this.attendance[existingIndex] = { date, present: presentCount, total: totalCount };
    } else {
      this.attendance.push({ date, present: presentCount, total: totalCount });
    }
  }

  getDailyAttendance(date: string) {
    return this.dailyAttendance[date] || {};
  }

  getStudentTodayStatus(studentId: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.dailyAttendance[today]?.[studentId] || 'not-marked';
  }

  getStudentAttendanceHistory(studentId: string) {
    const history = [];
    for (const date in this.dailyAttendance) {
      if (this.dailyAttendance[date][studentId]) {
        history.push({ date, status: this.dailyAttendance[date][studentId] });
      }
    }
    return history.sort((a, b) => b.date.localeCompare(a.date));
  }

  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const record = this.attendance.find(r => r.date === today);
    if (record && record.total > 0) {
      return Math.round((record.present / record.total) * 100);
    }
    return 0;
  }

  // Exam Result Methods
  getExamResults(examId?: string) {
    if (examId) {
      return this.examResults.filter(r => r.examId === examId);
    }
    return this.examResults;
  }

  saveExamResult(result: Omit<ExamResult, 'id'>) {
    const existingIndex = this.examResults.findIndex(
      r => r.examId === result.examId && r.studentId === result.studentId
    );

    const newResult = {
      ...result,
      id: existingIndex >= 0 ? this.examResults[existingIndex].id : `RES-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (existingIndex >= 0) {
      this.examResults[existingIndex] = newResult;
    } else {
      this.examResults.push(newResult);
    }
    return newResult;
  }

  getStudentResults(studentId: string) {
    return this.examResults.filter(r => r.studentId === studentId);
  }

  // Fee Methods
  getFeeTransactions() {
    return this.feeTransactions;
  }

  addFeeTransaction(transaction: Omit<FeeTransaction, 'id'>) {
    const newTxn = {
      ...transaction,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`
    };
    this.feeTransactions.unshift(newTxn);
    return newTxn;
  }

  updateFeeStatus(txnId: string, status: 'Paid' | 'Due', date?: string) {
    const txn = this.feeTransactions.find(t => t.id === txnId);
    if (txn) {
      txn.status = status;
      if (date) txn.date = date;
    }
  }

  getFeeSummary() {
    const totalCollected = this.feeTransactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDue = this.feeTransactions
      .filter(t => t.status === 'Due')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalCollected,
      totalDue,
      transactionCount: this.feeTransactions.length
    };
  }
  // Teacher Methods
  getTeachers() { return this.teachers; }

  addTeacher(teacher: Omit<Teacher, 'id'>) {
    const newTeacher = {
      ...teacher,
      id: `TR${1000 + this.teachers.length + 1}`
    };
    this.teachers.unshift(newTeacher);
    return newTeacher;
  }

  updateTeacher(id: string, updates: Partial<Teacher>) {
    const index = this.teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      this.teachers[index] = { ...this.teachers[index], ...updates };
      return this.teachers[index];
    }
    return null;
  }

  deleteTeacher(id: string) {
    this.teachers = this.teachers.filter(t => t.id !== id);
  }
}

export const dataStore = new DataStore();
