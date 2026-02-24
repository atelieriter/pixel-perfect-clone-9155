import { useState, useCallback } from 'react';
import VigilHeader from '@/components/vigil/VigilHeader';
import OrbitalMap from '@/components/vigil/OrbitalMap';
import Timeline from '@/components/vigil/Timeline';
import LaunchPanel from '@/components/vigil/LaunchPanel';
import SolarPanel from '@/components/vigil/SolarPanel';
import OrbitalOverviewPanel from '@/components/vigil/OrbitalOverviewPanel';
import CtaModal from '@/components/vigil/CtaModal';

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [modalEventHours, setModalEventHours] = useState<number | undefined>();
  const [filters, setFilters] = useState({
    iss: true,
    starlink: true,
    oneweb: true,
    geo: false,
    sites: false,
  });

  const openModal = useCallback((key: string, eventHours?: number) => {
    setModalKey(key);
    setModalEventHours(eventHours);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalEventHours(undefined);
  }, []);

  const toggleFilter = useCallback((key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <VigilHeader onSearch={() => openModal('search')} />

      <div className="flex flex-1 min-h-0" style={{ gap: '1px', background: 'hsl(var(--border))' }}>
        {/* Map column */}
        <div className="flex-1 flex flex-col min-w-0" style={{ gap: '1px', background: 'hsl(var(--border))' }}>
          <OrbitalMap filters={filters} onOpenModal={openModal} onToggleFilter={toggleFilter} />
          <Timeline onOpenModal={openModal} />
        </div>

        {/* Sidebar */}
        <div className="w-[350px] shrink-0 overflow-y-auto bg-bg2 flex flex-col" style={{ gap: '1px', background: 'hsl(var(--border))' }}>
          <LaunchPanel onOpenModal={openModal} />
          <SolarPanel onOpenModal={openModal} />
          <OrbitalOverviewPanel onOpenModal={openModal} />
        </div>
      </div>

      <CtaModal isOpen={modalOpen} modalKey={modalKey} onClose={closeModal} eventHours={modalEventHours} />
    </div>
  );
};

export default Index;