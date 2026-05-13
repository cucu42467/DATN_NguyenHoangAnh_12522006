"use client";

import React, { useState, useRef } from 'react';
import { taoGiaoDich } from '@/services/giaodich';
import { LoaiGiaoDich, type TaoGiaoDichDto } from '@/kieu_du_lieu/user';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  FileUp,
  Table,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Settings2,
  Database,
  Trash2,
  Search,
  ChevronDown,
  MousePointer2
} from 'lucide-react';
import Select from '@/thanh_phan/chung/Form/Select';

type Step = 'UPLOAD' | 'PICK_HEADER' | 'MAPPING' | 'REVIEW';

export default function TaiLenCSV() {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [fileName, setFileName] = useState<string>("");
  const [rawData, setRawData] = useState<any[][]>([]); // Lưu mảng 2 chiều thô
  const [headerRowIndex, setHeaderRowIndex] = useState<number>(-1);
  const [csvData, setCsvData] = useState<any[]>([]); // Dữ liệu sau khi đã cắt từ header
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState({
    date: '',
    debit: '', // Cột tiền chi
    credit: '', // Cột tiền thu
    description: ''
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);

    if (file.name.match(/\.(xlsx?|xls)$/i)) {
      // XLSX processing
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(firstSheet);

          Papa.parse(csv, {
            header: false, // Đọc thô để chọn dòng sau
            complete: (results) => {
              setRawData(results.data as any[][]);
              setStep('PICK_HEADER');
              setIsProcessing(false);
            },

            error: (error: Error) => {
              alert(`Lỗi đọc XLSX: ${error.message}`);
              setIsProcessing(false);
            }
          });
        } catch (error) {
          alert(`Lỗi parse XLSX: ${error}`);
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV processing
      Papa.parse(file, {
        header: false,
        complete: (results) => {
          setRawData(results.data as any[][]);
          setStep('PICK_HEADER');
          setIsProcessing(false);
        },
        error: (error: Error) => {
          alert("Lỗi khi đọc CSV: " + error.message);
          setIsProcessing(false);
        }
      });
    }
  };

  const handleSelectHeader = (index: number) => {
    setHeaderRowIndex(index);
    const selectedHeaders = rawData[index].map(h => h?.toString().trim() || `Cột ${index}`);
    setHeaders(selectedHeaders);

    // Chuyển đổi dữ liệu từ dòng index + 1 trở đi thành Array of Objects
    const dataRows = rawData.slice(index + 1)
      .filter(row => row.some(cell => cell?.toString().trim() !== ''))
      .map(row => {
        const obj: any = {};
        selectedHeaders.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });

    setCsvData(dataRows);
    setStep('MAPPING');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.match(/\.(csv|xlsx?|xls)$/i))) {
      handleFileUpload(file);
    }
  };

  const confirmImport = async () => {
    if (isImporting) return;
    setIsImporting(true);
    try {
      const giaoDichList = csvData.map(row => {
        const debit = Number(row[mappings.debit]?.toString().replace(/[ ,.]/g, '')) || 0;
        const credit = Number(row[mappings.credit]?.toString().replace(/[ ,.]/g, '')) || 0;
        const soTien = debit > 0 ? debit : credit;
        return {
          taiKhoanId: 1,
          ngay: row[mappings.date]?.toString().split('T')[0] || new Date().toISOString().split('T')[0],
          loai: debit > 0 ? 'CHI' : 'THU',
          soTien,
          moTa: row[mappings.description]?.toString() || '',
        };
      });
      for (const gd of giaoDichList) {
        await taoGiaoDich({
          SoTien: gd.soTien,
          LoaiGiaoDich: gd.loai === 'CHI' ? LoaiGiaoDich.CHI : LoaiGiaoDich.THU,
          TaiKhoanNguonId: 1, // Default, cần lấy từ context
          NgayGiaoDich: gd.ngay,
          GhiChu: gd.moTa
        } as any);
      }
      alert(`✅ Import ${csvData.length} giao dịch!`);
      setStep('UPLOAD');
      setCsvData([]);
      setHeaders([]);
    } catch (error) {
      console.error(error);
      alert(`Lỗi: ${error}`);
    } finally {
      setIsImporting(false);
    }
  };

  const formatAmount = (value: any) => {
    if (!value) return 'Không xác định';
    const cleanStr = value.toString().replace(/[,\s]/g, '');
    const num = Number(cleanStr);
    return isNaN(num) ? 'Không xác định' : num.toLocaleString('vi-VN');
  };

  const formatCell = (value: any) => {
    return (value && value.toString().trim()) || 'Không xác định';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Progress Stepper */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: 'UPLOAD', label: 'Tải lên', icon: FileUp },
          { id: 'PICK_HEADER', label: 'Chọn vùng', icon: MousePointer2 },
          { id: 'MAPPING', label: 'Ánh xạ', icon: Settings2 },
          { id: 'REVIEW', label: 'Kiểm tra', icon: Table },
        ].map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${step === s.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 scale-110 shadow-xl'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < 3 && <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 mb-6"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 'UPLOAD' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white dark:bg-zinc-900 border-2 border-dashed rounded-[2.5rem] p-16 text-center transition-all cursor-pointer group relative overflow-hidden ${isProcessing ? 'border-indigo-500 bg-indigo-50/20 animate-pulse' :
              isDragOver ? 'border-indigo-600 bg-indigo-50/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
            }`}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-indigo-600">Đang xử lý file...</div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <div className="flex flex-col items-center">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl text-zinc-300 group-hover:text-indigo-600 transition-all mb-6">
              <FileUp className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Bắt đầu Import dữ liệu</h3>
            <p className="text-xs text-zinc-400 mt-2 font-medium lowercase italic">Hỗ trợ CSV, Excel (.xlsx, .xls) từ ngân hàng</p>
          </div>
        </div>
      )}

      {/* Step 1.5: Pick Header Row */}
      {step === 'PICK_HEADER' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 p-6 rounded-3xl flex items-center gap-4">
            <MousePointer2 className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase italic">Chọn dòng tiêu đề</h3>
              <p className="text-[10px] text-amber-700/70 font-bold uppercase tracking-widest">Vui lòng click vào dòng chứa tiêu đề cột (Ngày, Số tiền, Nội dung...) trong bảng dưới đây.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="max-h-[500px] overflow-auto">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {rawData.slice(0, 30).map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleSelectHeader(idx)}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 text-[10px] font-black text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 w-12 text-center group-hover:text-indigo-600">{idx + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-4 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[120px] whitespace-nowrap">
                          {cell?.toString().slice(0, 50)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-start">
            <button onClick={() => setStep('UPLOAD')} className="px-8 py-4 text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Chọn file khác
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 'MAPPING' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl p-10 space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm text-indigo-600">
                <Settings2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-900 dark:text-white uppercase italic tracking-widest">Khớp nối dữ liệu</h3>
                <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 font-bold uppercase tracking-widest">File: {fileName} | {csvData.length} dòng</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Select
              label="Cột Ngày Giao Dịch"
              options={headers.map(h => ({ value: h, label: h }))}
              value={mappings.date}
              onChange={(e) => setMappings({ ...mappings, date: e.target.value })}
            />
            <Select
              label="Cột Tiền Chi (Debit)"
              options={headers.map(h => ({ value: h, label: h }))}
              value={mappings.debit}
              onChange={(e) => setMappings({ ...mappings, debit: e.target.value })}
            />
            <Select
              label="Cột Tiền Thu (Credit)"
              options={headers.map(h => ({ value: h, label: h }))}
              value={mappings.credit}
              onChange={(e) => setMappings({ ...mappings, credit: e.target.value })}
            />
            <Select
              label="Cột Nội Dung/Mô Tả"
              options={headers.map(h => ({ value: h, label: h }))}
              value={mappings.description}
              onChange={(e) => setMappings({ ...mappings, description: e.target.value })}
            />
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <button onClick={() => setStep('PICK_HEADER')} className="px-8 py-4 text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 hover:text-zinc-600">
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <button
              disabled={!mappings.date || (!mappings.debit && !mappings.credit) || !mappings.description}
              onClick={() => setStep('REVIEW')}
              className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl text-sm font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              KIỂM TRA DỮ LIỆU <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'REVIEW' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Review & Xử lý trùng lặp</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <CheckCircle2 className="h-4 w-4" /> {csvData.length} dòng đã sẵn sàng
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800 z-10">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-700">Ngày</th>
                    <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-700">Mô tả</th>
                    <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-700 text-right">Số tiền</th>
                    <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-700 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-6 text-xs font-bold text-zinc-600 dark:text-zinc-300 italic">{formatCell(row[mappings.date])}</td>
                      <td className="p-6 text-sm font-medium text-zinc-900 dark:text-white max-w-xs truncate">{formatCell(row[mappings.description])}</td>
                      <td className={`p-6 text-sm font-black text-right ${row[mappings.debit] ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {row[mappings.debit] ? '-' : '+'}{formatAmount(row[mappings.debit] || row[mappings.credit])}
                      </td>
                      <td className="p-6 text-center">
                        {row[mappings.debit] ? (
                          <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg text-[10px] font-black uppercase italic">Chi</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg text-[10px] font-black uppercase italic">Thu</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {csvData.length > 10 && (
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Và {csvData.length - 10} dòng dữ liệu khác...
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 pt-10">
            <button onClick={() => setStep('MAPPING')} className="px-8 py-4 text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 hover:text-zinc-600">
              <ArrowLeft className="h-4 w-4" /> Quay lại ánh xạ
            </button>
            <button
              onClick={confirmImport}
              disabled={isImporting}
              className="px-12 py-5 bg-indigo-600 text-white rounded-3xl text-sm font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Đang import...' : <Database className="h-5 w-5 group-hover:animate-bounce" />}
              CONFIRM & IMPORT {csvData.length} GIAO DỊCH
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
