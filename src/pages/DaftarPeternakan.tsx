
import React, { useState } from 'react';
import { useGoats, Goat } from '../context/GoatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DaftarPeternakan: React.FC = () => {
  const { goats, addGoat, updateGoat, deleteGoat } = useGoats();
  
  const [selectedBarn, setSelectedBarn] = useState<'Timur' | 'Barat' | 'all'>('all');
  const [filteredGoats, setFilteredGoats] = useState<Goat[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [goatId, setGoatId] = useState('');
  const [barn, setBarn] = useState<'Timur' | 'Barat'>('Timur');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Jantan' | 'Betina'>('Jantan');
  const [status, setStatus] = useState<'Hidup' | 'Sakit' | 'Mati'>('Hidup');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [goatToDelete, setGoatToDelete] = useState<string | null>(null);
  const [goatToEdit, setGoatToEdit] = useState<string | null>(null);
  
  const handleBarnSelect = (value: string) => {
    setSelectedBarn(value as 'Timur' | 'Barat' | 'all');
    if (value === 'all') {
      // Show all goats when 'all' is selected
      setFilteredGoats(goats);
    } else {
      // Filter goats by selected barn
      const filtered = goats.filter(goat => goat.barn === value);
      setFilteredGoats(filtered);
    }
    setCurrentPage(1);
  };
  
  const resetForm = () => {
    setGoatId('');
    setBarn('Timur');
    setWeight('');
    setAge('');
    setGender('Jantan');
    setStatus('Hidup');
  };
  
  const handleShowAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleShowEditDialog = (id: string) => {
    const goat = goats.find(goat => goat.id === id);
    if (goat) {
      setGoatToEdit(id);
      setGoatId(goat.id);
      setBarn(goat.barn);
      setWeight(goat.weight.toString());
      setAge(goat.age.toString());
      setGender(goat.gender);
      setStatus(goat.status);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleShowDeleteDialog = (id: string) => {
    setGoatToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddGoat = () => {
    if (!weight || !age) {
      toast({
        variant: "destructive",
        title: "Formulir belum lengkap",
        description: "Silakan isi semua field yang diperlukan."
      });
      return;
    }
    
    const newGoat = {
      barn,
      weight: parseFloat(weight),
      age: parseInt(age),
      gender,
      status
    };
    
    addGoat(newGoat);
    
    // Refresh the filtered list if a barn is selected
    if (selectedBarn !== 'all' && selectedBarn === barn) {
      const filtered = [...filteredGoats, { ...newGoat, id: `K${String(goats.length + 1).padStart(3, '0')}` }];
      setFilteredGoats(filtered);
    } else if (selectedBarn === 'all') {
      setFilteredGoats([...goats, { ...newGoat, id: `K${String(goats.length + 1).padStart(3, '0')}` }]);
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditGoat = () => {
    if (!goatToEdit || !weight || !age) {
      toast({
        variant: "destructive",
        title: "Formulir belum lengkap",
        description: "Silakan isi semua field yang diperlukan."
      });
      return;
    }
    
    const updatedGoat = {
      barn,
      weight: parseFloat(weight),
      age: parseInt(age),
      gender,
      status
    };
    
    updateGoat(goatToEdit, updatedGoat);
    
    // Refresh the filtered list if a barn is selected
    if (selectedBarn !== 'all') {
      const updatedFiltered = filteredGoats.map(goat => 
        goat.id === goatToEdit ? { ...updatedGoat, id: goatToEdit } as Goat : goat
      );
      
      // If barn changed and doesn't match filter, remove from filtered list
      if (barn !== selectedBarn) {
        const newFiltered = updatedFiltered.filter(goat => goat.id !== goatToEdit);
        setFilteredGoats(newFiltered);
      } else {
        setFilteredGoats(updatedFiltered);
      }
    } else if (selectedBarn === 'all') {
      // Update in the full list
      setFilteredGoats(goats.map(goat => 
        goat.id === goatToEdit ? { ...updatedGoat, id: goatToEdit } as Goat : goat
      ));
    }
    
    setIsEditDialogOpen(false);
    setGoatToEdit(null);
    resetForm();
  };
  
  const handleDeleteGoat = () => {
    if (goatToDelete) {
      deleteGoat(goatToDelete);
      
      // Update filtered list if needed
      if (selectedBarn !== 'all') {
        const newFiltered = filteredGoats.filter(goat => goat.id !== goatToDelete);
        setFilteredGoats(newFiltered);
      } else {
        setFilteredGoats(goats.filter(goat => goat.id !== goatToDelete));
      }
      
      setIsDeleteDialogOpen(false);
      setGoatToDelete(null);
    }
  };
  
  // Initialize filtered goats when component loads or goats change
  React.useEffect(() => {
    if (selectedBarn === 'all') {
      setFilteredGoats(goats);
    } else {
      const filtered = goats.filter(goat => goat.barn === selectedBarn);
      setFilteredGoats(filtered);
    }
  }, [goats, selectedBarn]);
  
  // Pagination
  const totalPages = Math.ceil(filteredGoats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGoats = filteredGoats.slice(startIndex, startIndex + itemsPerPage);
  
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={currentPage === i ? "default" : "outline"}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Hidup':
        return 'badge badge-success';
      case 'Sakit':
        return 'badge badge-warning';
      case 'Mati':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-farmblue mb-6">Daftar Peternakan</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Data Kambing</CardTitle>
            <Button 
              onClick={handleShowAddDialog}
              className="bg-farmblue hover:bg-farmblue-dark"
            >
              <Plus size={16} className="mr-2" /> Tambah Daftar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Select value={selectedBarn} onValueChange={handleBarnSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kandang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Semua Kandang</SelectItem>
                    <SelectItem value="Timur">Kandang Timur</SelectItem>
                    <SelectItem value="Barat">Kandang Barat</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                onClick={() => handleBarnSelect(selectedBarn)} 
                variant="outline"
              >
                Lihat Kandang
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Kambing</TableHead>
                  <TableHead>Berat (kg)</TableHead>
                  <TableHead>Umur (bulan)</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGoats.length > 0 ? (
                  currentGoats.map((goat) => (
                    <TableRow key={goat.id}>
                      <TableCell className="font-medium">{goat.id}</TableCell>
                      <TableCell>{goat.weight}</TableCell>
                      <TableCell>{goat.age}</TableCell>
                      <TableCell>{goat.gender}</TableCell>
                      <TableCell>
                        <span className={getStatusBadgeClass(goat.status)}>
                          {goat.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700"
                            onClick={() => handleShowEditDialog(goat.id)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleShowDeleteDialog(goat.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Tidak ada data yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {filteredGoats.length > 0 && (
            <div className="flex justify-center mt-4 space-x-1">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                variant="outline"
                className="h-8 px-2"
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {renderPageNumbers()}
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                variant="outline"
                className="h-8 px-2"
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Goat Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Daftar</DialogTitle>
            <DialogDescription>
              Tambahkan data kambing baru ke dalam sistem.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barn" className="text-right">
                Kandang
              </Label>
              <Select value={barn} onValueChange={(value) => setBarn(value as 'Timur' | 'Barat')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kandang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Timur">Kandang Timur</SelectItem>
                  <SelectItem value="Barat">Kandang Barat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Umur (bulan)
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Jenis Kelamin
              </Label>
              <Select value={gender} onValueChange={(value) => setGender(value as 'Jantan' | 'Betina')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jantan">Jantan</SelectItem>
                  <SelectItem value="Betina">Betina</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'Hidup' | 'Sakit' | 'Mati')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hidup">Hidup</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Mati">Mati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Kembali
            </Button>
            <Button onClick={handleAddGoat} className="bg-farmblue hover:bg-farmblue-dark">
              Tambah Daftar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Goat Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Daftar</DialogTitle>
            <DialogDescription>
              Edit data kambing dengan ID: {goatId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barn" className="text-right">
                Kandang
              </Label>
              <Select value={barn} onValueChange={(value) => setBarn(value as 'Timur' | 'Barat')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kandang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Timur">Kandang Timur</SelectItem>
                  <SelectItem value="Barat">Kandang Barat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Umur (bulan)
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Jenis Kelamin
              </Label>
              <Select value={gender} onValueChange={(value) => setGender(value as 'Jantan' | 'Betina')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jantan">Jantan</SelectItem>
                  <SelectItem value="Betina">Betina</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'Hidup' | 'Sakit' | 'Mati')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hidup">Hidup</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Mati">Mati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Kembali
            </Button>
            <Button onClick={handleEditGoat} className="bg-green-600 hover:bg-green-700">
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apa kamu yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data kambing ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoat} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DaftarPeternakan;
