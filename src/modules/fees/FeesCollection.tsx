import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Receipt, CreditCard, Download, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { dataStore, FeeTransaction } from '@/services/dataService';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

export default function FeesCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [selectedTxnIds, setSelectedTxnIds] = useState<string[]>([]);
  const [summary, setSummary] = useState({ totalCollected: 0, totalDue: 0, transactionCount: 0 });

  useEffect(() => {
    setTransactions(dataStore.getFeeTransactions());
    setSummary(dataStore.getFeeSummary());
  }, []);

  const handleCollect = (txnId: string) => {
    const today = new Date().toISOString().split('T')[0];
    dataStore.updateFeeStatus(txnId, 'Paid', today);
    const updatedTxns = dataStore.getFeeTransactions();
    setTransactions([...updatedTxns]);
    setSummary(dataStore.getFeeSummary());
    toast.success('Fee collected successfully');
    
    // Automatically download receipt
    const txn = updatedTxns.find(t => t.id === txnId);
    if (txn) {
      downloadReceipt(txn);
    }
  };

  const downloadReceipt = (txn: FeeTransaction) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("SCHOOL MANAGEMENT SYSTEM", 105, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.text("PAYMENT RECEIPT", 105, 30, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Details
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      
      const startY = 50;
      const lineHeight = 10;
      
      doc.text(`Invoice No: ${txn.invoiceNo}`, 20, startY);
      doc.text(`Date: ${txn.date || new Date().toISOString().split('T')[0]}`, 140, startY);
      
      doc.text(`Student Name: ${txn.studentName}`, 20, startY + lineHeight);
      doc.text(`Student ID: ${txn.studentId}`, 20, startY + lineHeight * 2);
      doc.text(`Class: ${txn.studentClass} (${txn.studentSection})`, 20, startY + lineHeight * 3);
      
      doc.line(20, startY + lineHeight * 4, 190, startY + lineHeight * 4);
      
      doc.setFontSize(14);
      doc.text("Description", 20, startY + lineHeight * 5);
      doc.text("Amount", 170, startY + lineHeight * 5, { align: "right" });
      
      doc.setFontSize(12);
      doc.text(`${txn.type} Fee - ${txn.month}`, 20, startY + lineHeight * 6);
      doc.text(`৳ ${txn.amount.toLocaleString()}`, 170, startY + lineHeight * 6, { align: "right" });
      
      doc.line(20, startY + lineHeight * 7, 190, startY + lineHeight * 7);
      
      doc.setFontSize(14);
      doc.text("Total Paid:", 120, startY + lineHeight * 8);
      doc.text(`৳ ${txn.amount.toLocaleString()}`, 170, startY + lineHeight * 8, { align: "right" });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("This is a computer generated receipt and does not require a signature.", 105, 150, { align: "center" });
      
      doc.save(`Receipt_${txn.invoiceNo}.pdf`);
      toast.info(`Receipt downloaded: ${txn.invoiceNo}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate receipt PDF");
    }
  };

  const handleMarkDue = (txnId: string) => {
    dataStore.updateFeeStatus(txnId, 'Due', '');
    setTransactions([...dataStore.getFeeTransactions()]);
    setSummary(dataStore.getFeeSummary());
    toast.info('Transaction marked as due');
  };

  const toggleSelectAll = () => {
    if (selectedTxnIds.length === filteredTransactions.length) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(filteredTransactions.map(t => t.id));
    }
  };

  const toggleSelectTxn = (id: string) => {
    if (selectedTxnIds.includes(id)) {
      setSelectedTxnIds(selectedTxnIds.filter(tid => tid !== id));
    } else {
      setSelectedTxnIds([...selectedTxnIds, id]);
    }
  };

  const handleBulkUpdateStatus = (status: 'Paid' | 'Due') => {
    const today = new Date().toISOString().split('T')[0];
    selectedTxnIds.forEach(id => {
      dataStore.updateFeeStatus(id, status, status === 'Paid' ? today : '');
    });
    setTransactions([...dataStore.getFeeTransactions()]);
    setSummary(dataStore.getFeeSummary());
    setSelectedTxnIds([]);
    toast.success(`Bulk updated ${selectedTxnIds.length} transactions to ${status}`);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      txn.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'All Classes' || txn.studentClass === selectedClass;
    const matchesSection = selectedSection === 'All Sections' || txn.studentSection === selectedSection;

    return matchesSearch && matchesClass && matchesSection;
  });

  const classes = ['All Classes', ...new Set(dataStore.getClasses().map(c => c.name))];
  const sections = ['All Sections', 'A', 'B', 'C'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fees & Accounts</h2>
          <p className="text-muted-foreground text-sm">Manage student fee collections and financial records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Collect Fee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">৳ {summary.totalCollected.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">৳ {summary.totalDue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <div className="p-2 bg-slate-100 rounded-full">
              <CreditCard className="w-4 h-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.transactionCount}</div>
          </CardContent>
        </Card>
      </div>

      {selectedTxnIds.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{selectedTxnIds.length} transactions selected</span>
              <div className="h-4 w-px bg-primary/20" />
              <div className="flex gap-2">
                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleBulkUpdateStatus('Paid')}>
                  Mark as Paid
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleBulkUpdateStatus('Due')}>
                  Mark as Due
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTxnIds([])}>Cancel</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Fee Collection</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search student..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedTxnIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id} className={selectedTxnIds.includes(txn.id) ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedTxnIds.includes(txn.id)}
                      onChange={() => toggleSelectTxn(txn.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{txn.invoiceNo}</TableCell>
                  <TableCell>
                    <div className="font-bold">{txn.studentName}</div>
                    <div className="text-xs text-muted-foreground">{txn.studentId}</div>
                  </TableCell>
                  <TableCell>{txn.studentClass}</TableCell>
                  <TableCell>{txn.month}</TableCell>
                  <TableCell>{txn.type}</TableCell>
                  <TableCell className="font-bold">৳ {txn.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      txn.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </TableCell>
                  <TableCell>{txn.date || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {txn.status === 'Paid' ? (
                        <>
                          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => downloadReceipt(txn)}>
                            <Receipt className="w-3.5 h-3.5" />
                            Receipt
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive hover:text-destructive" onClick={() => handleMarkDue(txn.id)}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Mark Due
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleCollect(txn.id)}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Collect
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="w-8 h-8 opacity-20" />
                      <p>No transactions found for the selected criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
