// Test component to verify consistent layout spacing
import React from 'react';

const LayoutSpacingTest = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Layout Spacing Test
        </h1>
        <p className="text-blue-700">
          This page tests the consistent spacing between sidebar and content across all layouts.
        </p>
      </div>

      {/* Spacing Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Visual Spacing Guide */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expected Spacing
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Sidebar: 64px (expanded)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Gap: 24px (lg:pl-6)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Content: Remaining space</span>
            </div>
          </div>
        </div>

        {/* Layout Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Layout Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AdminLayout</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✓ Updated
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">DoctorLayout</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✓ Updated
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">PatientLayout</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✓ Updated
              </span>
            </div>
          </div>
        </div>

        {/* CSS Classes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            CSS Classes Used
          </h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="bg-gray-100 px-2 py-1 rounded">
              .sidebar-content-gap
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded">
              .layout-transition
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded">
              .sidebar-collapsed
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded">
              .sidebar-expanded
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded">
              .content-padding
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded">
              .layout-main
            </div>
          </div>
        </div>
      </div>

      {/* Visual Ruler */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Visual Spacing Ruler
        </h3>
        <div className="relative">
          {/* Ruler */}
          <div className="flex items-center space-x-0 mb-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-4 h-6 ${i % 5 === 0 ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                {i % 5 === 0 && (
                  <span className="text-xs text-gray-500 mt-1">{i * 4}px</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Content Area Indicator */}
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4">
            <p className="text-blue-700 text-center">
              This content area should have consistent spacing from the sidebar across all layouts
            </p>
          </div>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">
          Testing Instructions
        </h3>
        <div className="space-y-3 text-yellow-800">
          <p>1. Navigate to different dashboard pages (Admin, Doctor, Patient)</p>
          <p>2. Toggle the sidebar collapse/expand button</p>
          <p>3. Verify that the content spacing remains consistent</p>
          <p>4. Check on different screen sizes (desktop, tablet, mobile)</p>
          <p>5. Ensure smooth transitions when toggling sidebar</p>
        </div>
      </div>

      {/* Current Layout Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Layout Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Sidebar Width (Expanded):</strong> 256px (w-64)
          </div>
          <div>
            <strong>Sidebar Width (Collapsed):</strong> 64px (w-16)
          </div>
          <div>
            <strong>Content Gap:</strong> 24px (lg:pl-6)
          </div>
          <div>
            <strong>Content Padding:</strong> 16px/24px/32px (responsive)
          </div>
          <div>
            <strong>Transition Duration:</strong> 300ms
          </div>
          <div>
            <strong>Transition Easing:</strong> ease-in-out
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSpacingTest;
