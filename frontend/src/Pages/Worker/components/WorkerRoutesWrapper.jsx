import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalOverheatModal from './GlobalOverheatModal';
import TaskCompleteModal from './TaskCompleteModal'; // Import the TaskCompleteModal

const WorkerRoutesWrapper = () => {
  const location = useLocation();

  // Check if the current route is within the /worker path
  const isWorkerRoute = location.pathname.startsWith('/worker');

  return (
    <>
      <Outlet /> {/* Render the nested routes */}
      {isWorkerRoute && <GlobalOverheatModal />} {/* Render GlobalOverheatModal only for worker routes */}
      {isWorkerRoute && <TaskCompleteModal />} {/* Render TaskCompleteModal only for worker routes */}
    </>
  );
};

export default WorkerRoutesWrapper;