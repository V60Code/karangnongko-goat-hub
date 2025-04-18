
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '../context/AuthContext';
import { Users, Home, BarChartHorizontal, Pill } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-xl font-medium text-gray-700">Halo, {user?.name || user?.username || 'User'}!</h1>
        <h2 className="text-2xl font-bold text-farmblue mt-2">
          Dashboard Sistem Informasi Manajemen Peternakan Karangnongko
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {/* KPI Card 1 */}
        <Card className="card-farm hover:border-farmblue group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Kambing</CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-farmblue group-hover:bg-blue-200 transition-colors">
              <Home size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">60</div>
            <p className="text-xs text-gray-500 mt-1">Seluruh kandang</p>
          </CardContent>
        </Card>
        
        {/* KPI Card 2 */}
        <Card className="card-farm hover:border-farmblue group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Kandang Timur</CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
              <Home size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">40</div>
            <p className="text-xs text-gray-500 mt-1">Kambing di Kandang Timur</p>
          </CardContent>
        </Card>
        
        {/* KPI Card 3 */}
        <Card className="card-farm hover:border-farmblue group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Kandang Barat</CardTitle>
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
              <Home size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">20</div>
            <p className="text-xs text-gray-500 mt-1">Kambing di Kandang Barat</p>
          </CardContent>
        </Card>
        
        {/* KPI Card 4 */}
        <Card className="card-farm hover:border-farmblue group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Jumlah User</CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
              <Users size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1">Pengelola aktif</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Additional Info Cards */}
        <Card className="card-farm hover:border-farmblue">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-farmblue">
              <BarChartHorizontal className="mr-2" size={20} />
              Statistik Supplier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Supplier Pakan</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supplier Obat</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supplier Peralatan</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-farm hover:border-farmblue">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-farmblue">
              <Pill className="mr-2" size={20} />
              Obat yang Sering Digunakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Wormin (Anti parasit)</span>
                <span className="badge badge-success">12x</span>
              </div>
              <div className="flex justify-between items-center">
                <span>B-Complex (Vitamin)</span>
                <span className="badge badge-success">8x</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Antibiotik</span>
                <span className="badge badge-warning">5x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
