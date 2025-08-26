import React from 'react';
import Card from '../../Manager/components/UI/Card';
import FinishedProductGraph from './inventoryComponents/FinishedProductGraph';
import RawMaterialGraph from './inventoryComponents/RawMaterialGraph';
import DailyFinishedProductForm from './inventoryComponents/DailyFinishedProductForm';
import DailyRawMaterialForm from './inventoryComponents/DailyRawMaterialForm';
import ReportDownload from './inventoryComponents/ReportDownload';
import SupplierManagement from './inventoryComponents/SupplierManagement';
import ReorderAlert from './inventoryComponents/ReorderAlert';

const Inventory = () => {
  return (
    <div className="space-y-4">
      {/* Single Reorder Alert at the top
      <ReorderAlert /> */}

      {/* Report Download Section */}
      <Card title="Inventory Reports">
        <ReportDownload />
      </Card>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Finished Product Production">
          <FinishedProductGraph />
        </Card>
        <Card title="Raw Material Trends">
          <RawMaterialGraph />
        </Card>
      </div>

      {/* Daily Forms Section */}
      <DailyFinishedProductForm />
      <DailyRawMaterialForm />

      {/* Supplier Management Section */}
      <SupplierManagement />
    </div>
  );
};

export default Inventory;