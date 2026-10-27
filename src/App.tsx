import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MaterialsView } from './components/MaterialsView';
import { BatchesView } from './components/BatchesView';
import { EnergyView } from './components/EnergyView';
import { CarbonCalculatorView } from './components/CarbonCalculatorView';
import { WasteView } from './components/WasteView';
import { ReportsView } from './components/ReportsView';
import { SdgAlignmentView } from './components/SdgAlignmentView';
import { SchemaExplorerView } from './components/SchemaExplorerView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';

import { 
  initialUsers, 
  initialMaterials, 
  initialBatches, 
  initialEnergyRecords, 
  initialWasteRecords, 
  initialEmissionFactors, 
  initialAuditLogs 
} from './data/initialData';

import { 
  User, 
  UserRole, 
  Material, 
  TreatmentBatch, 
  EnergyRecord, 
  WasteRecord, 
  EmissionFactor, 
  BatchStatus 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [batches, setBatches] = useState<TreatmentBatch[]>(initialBatches);
  const [energyRecords, setEnergyRecords] = useState<EnergyRecord[]>(initialEnergyRecords);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(initialWasteRecords);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>(initialEmissionFactors);

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Add Material Handler
  const handleAddMaterial = (newMat: Omit<Material, 'id' | 'createdAt'>) => {
    const created: Material = {
      ...newMat,
      id: materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setMaterials([created, ...materials]);
    showNotification(`Material ${created.materialCode} (${created.grade}) registered.`);
  };

  // Delete Material Handler
  const handleDeleteMaterial = (id: number) => {
    const toDelete = materials.find((m) => m.id === id);
    setMaterials(materials.filter((m) => m.id !== id));
    showNotification(`Material ${toDelete?.materialCode} removed from inventory.`);
  };

  // Add Treatment Batch Handler
  const handleAddBatch = (newBatch: Omit<TreatmentBatch, 'id'>) => {
    const created: TreatmentBatch = {
      ...newBatch,
      id: batches.length > 0 ? Math.max(...batches.map((b) => b.id)) + 1 : 1,
    };
    setBatches([created, ...batches]);
    showNotification(`Batch ${created.batchCode} launched at ${created.furnaceTemperatureC}°C.`);
  };

  // Update Batch Status Handler
  const handleUpdateBatchStatus = (id: number, status: BatchStatus, actualHardness?: number) => {
    setBatches(
      batches.map((b) =>
        b.id === id
          ? {
              ...b,
              batchStatus: status,
              actualHardnessHrc: actualHardness !== undefined ? actualHardness : b.actualHardnessHrc,
              completionDate: status === 'COMPLETED' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : b.completionDate,
            }
          : b
      )
    );
    showNotification(`Batch #${id} marked as ${status}.`);
  };

  // Add Energy Record Handler
  const handleAddEnergyRecord = (
    rec: Omit<EnergyRecord, 'id' | 'calculatedEmissionsKgCO2e' | 'energyPerKgMaterial' | 'recordedAt'>
  ) => {
    const batch = batches.find((b) => b.id === rec.batchId);
    const factor = emissionFactors.find((f) => f.id === rec.emissionFactorId) || emissionFactors[0];
    const emissions = rec.consumptionValue * factor.emissionFactorValue;
    const weight = batch?.materialWeightKg || 500;
    const kwhPerKg = weight > 0 ? rec.consumptionValue / weight : 0;

    const created: EnergyRecord = {
      ...rec,
      id: energyRecords.length > 0 ? Math.max(...energyRecords.map((e) => e.id)) + 1 : 1,
      calculatedEmissionsKgCO2e: emissions,
      energyPerKgMaterial: kwhPerKg,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setEnergyRecords([created, ...energyRecords]);
    showNotification(`Energy log #${created.id} saved: ${created.consumptionValue} ${created.unit} (${emissions.toFixed(2)} kg CO₂e).`);
  };

  // Add Waste Record Handler
  const handleAddWasteRecord = (rec: Omit<WasteRecord, 'id' | 'recordedAt'>) => {
    const created: WasteRecord = {
      ...rec,
      id: wasteRecords.length > 0 ? Math.max(...wasteRecords.map((w) => w.id)) + 1 : 1,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setWasteRecords([created, ...wasteRecords]);
    showNotification(`Scrap record saved: ${created.totalScrapWeightKg} kg (${created.wasteCategory}).`);
  };

  // Update Emission Factor Handler (Admin only)
  const handleUpdateFactor = (id: number, value: number, sourceDoc: string) => {
    setEmissionFactors(
      emissionFactors.map((f) =>
        f.id === id ? { ...f, emissionFactorValue: value, sourceDocumentation: sourceDoc } : f
      )
    );
    showNotification(`Emission factor #${id} updated to ${value.toFixed(6)}.`);
  };

  // Quick Role Switcher
  const handleSwitchRole = (role: UserRole) => {
    const userForRole = initialUsers.find((u) => u.role === role) || initialUsers[0];
    setCurrentUser(userForRole);
    showNotification(`Session switched to ${userForRole.fullName} (${role}).`);
  };

  // Quick Action Handler from Header
  const handleQuickAction = (action: string) => {
    if (action === 'new-batch') {
      setActiveTab('batches');
      setIsNewBatchModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F8FB] text-[#1F2937] font-sans">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showNotification('Logged out successfully.');
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 2. Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onQuickAction={handleQuickAction}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-5 right-5 bg-[#0B1F3A] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 z-50 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              batches={batches}
              materials={materials}
              energyRecords={energyRecords}
              wasteRecords={wasteRecords}
              currentUser={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewBatchModal={() => {
                setActiveTab('batches');
                setIsNewBatchModalOpen(true);
              }}
            />
          )}

          {activeTab === 'batches' && (
            <BatchesView
              batches={batches}
              materials={materials}
              onAddBatch={handleAddBatch}
              onUpdateBatchStatus={handleUpdateBatchStatus}
              currentUser={currentUser}
              isCreateModalOpen={isNewBatchModalOpen}
              setIsCreateModalOpen={setIsNewBatchModalOpen}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsView
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'energy' && (
            <EnergyView
              energyRecords={energyRecords}
              batches={batches}
              emissionFactors={emissionFactors}
              onAddEnergyRecord={handleAddEnergyRecord}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'emissions' && (
            <CarbonCalculatorView
              emissionFactors={emissionFactors}
              onUpdateFactor={handleUpdateFactor}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'waste' && (
            <WasteView
              wasteRecords={wasteRecords}
              batches={batches}
              onAddWasteRecord={handleAddWasteRecord}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              batches={batches}
              materials={materials}
              energyRecords={energyRecords}
              wasteRecords={wasteRecords}
            />
          )}

          {activeTab === 'sdg' && <SdgAlignmentView />}

          {activeTab === 'schema' && <SchemaExplorerView />}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              emissionFactors={emissionFactors}
            />
          )}
        </main>
      </div>

      {/* Login / Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          showNotification(`Authenticated as ${user.fullName} (${user.role}).`);
        }}
        users={initialUsers}
      />
    </div>
  );
}
