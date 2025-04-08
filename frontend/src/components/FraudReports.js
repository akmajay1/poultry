import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const FraudReports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/proof/fraud-reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setReports(response.data);
        calculateStats(response.data);
      } catch (error) {
        console.error('Error fetching fraud reports:', error);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (data) => {
    const stats = {
      totalCases: data.length,
      hashMatches: data.filter(r => r.matchedSubmissions.some(m => m.type === 'hash_match')).length,
      exifMatches: data.filter(r => r.matchedSubmissions.some(m => m.type === 'exif_similarity')).length,
    };
    setStats(stats);
  };

  const chartData = {
    labels: [t('hash_matches'), t('exif_matches')],
    datasets: [{
      label: t('fraud_cases'),
      data: [stats.hashMatches, stats.exifMatches],
      backgroundColor: ['#ff6384', '#36a2eb']
    }]
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{t('fraud_reports')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-600 font-medium">{t('total_cases')}</h3>
          <p className="text-2xl">{stats.totalCases}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-600 font-medium">{t('image_reuse')}</h3>
          <p className="text-2xl">{stats.hashMatches}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-600 font-medium">{t('metadata_match')}</h3>
          <p className="text-2xl">{stats.exifMatches}</p>
        </div>
      </div>

      <div className="mb-8">
        <Bar 
          data={chartData}
          options={{ 
            responsive: true,
            plugins: { legend: { position: 'top' } }
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">{t('user')}</th>
              <th className="px-6 py-3 text-left">{t('detection_type')}</th>
              <th className="px-6 py-3 text-left">{t('submission_date')}</th>
              <th className="px-6 py-3 text-left">{t('location_validation')}</th>
              <th className="px-6 py-3 text-left">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedReport(report)}>
                <td className="px-6 py-4">{report.user.username}</td>
                <td className="px-6 py-4">
                  {report.matchedSubmissions.map(m => 
  `${t(m.type + '_percentage')}`.replace('%{percentage}', m.similarityPercentage)
).join(', ')}
                </td>
                <td className="px-6 py-4">
                  {new Date(report.detectionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${report.locationMismatch 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'}`}>
                    {t(report.locationMismatch ? 'location_mismatch' : 'location_valid')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${report.status === 'pending review' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'}`}>
                    {t(report.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">{t('exif_details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{t('camera_model')}:</p>
                <p>{selectedReport.exifData?.Model || t('not_available')}</p>
              </div>
              <div>
                <p className="font-medium">{t('location')}:</p>
                <p>{selectedReport.exifData?.GPSLatitude || t('no_gps_data')}</p>
              </div>
              <div>
                <p className="font-medium">{t('farm_coordinates')}:</p>
                <p>{selectedReport.farmLocation?.coordinates.join(', ') || t('not_set')}</p>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setSelectedReport(null)}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudReports;