import UserActivityReport from './UserActivityReport';

// Export all report components
export {
  UserActivityReport
};

// Main reports component that can be used to manage all reports
const Reports = () => {
  return (
    <div>
      <UserActivityReport />
    </div>
  );
};

export default Reports; 