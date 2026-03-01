import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';
import { dataStore, ClassInfo } from '@/services/dataService';

export default function AcademicModule() {
  const [classes, setClasses] = useState<ClassInfo[]>(dataStore.getClasses());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  const refreshClasses = () => {
    setClasses([...dataStore.getClasses()]);
  };

  const [formData, setFormData] = useState({
    name: '',
    level: 'Primary',
    sections: '',
    subjects: ''
  });

  const handleOpenModal = (cls: any = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        name: cls.name,
        level: cls.level,
        sections: cls.sections.join(', '),
        subjects: cls.subjects.join(', ')
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', level: 'Primary', sections: '', subjects: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classData = {
      name: formData.name,
      level: formData.level,
      sections: formData.sections.split(',').map(s => s.trim()).filter(s => s),
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
    };

    if (editingClass) {
      dataStore.updateClass(editingClass.id, classData);
    } else {
      dataStore.addClass(classData);
    }
    refreshClasses();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      dataStore.deleteClass(id);
      refreshClasses();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Academic Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Subjects
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classes & Subjects Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Assigned Subjects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {cls.sections.map(sec => (
                        <span key={sec} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-muted-foreground/20">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects.map(sub => (
                        <span key={sub} className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium ring-1 ring-inset ring-primary/20">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cls)}>
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class Name</label>
                  <Input 
                    required 
                    placeholder="e.g. Class 7"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academic Level</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: e.target.value})}
                  >
                    <option>Pre-Primary</option>
                    <option>Primary</option>
                    <option>Secondary</option>
                    <option>Higher Secondary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sections (comma separated)</label>
                  <Input 
                    placeholder="A, B, C"
                    value={formData.sections}
                    onChange={e => setFormData({...formData, sections: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subjects (comma separated)</label>
                  <Input 
                    placeholder="Bangla, English, Math"
                    value={formData.subjects}
                    onChange={e => setFormData({...formData, subjects: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingClass ? 'Update Class' : 'Create Class'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
