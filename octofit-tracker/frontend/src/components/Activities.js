import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const API_ENDPOINT = `${API_BASE_URL}/activities/`;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('Fetching activities from:', API_ENDPOINT);
        setLoading(true);
        
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Activities API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Processed activities data:', activitiesData);
        
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [API_ENDPOINT]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading activities</h4>
          <p>{error}</p>
          <p><strong>API Endpoint:</strong> {API_ENDPOINT}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Activities</h2>
      <p className="text-muted">API Endpoint: {API_ENDPOINT}</p>
      
      {activities.length === 0 ? (
        <div className="alert alert-info">
          <p>No activities found.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">Type</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Calories</th>
                    <th scope="col">Date</th>
                    <th scope="col">User</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.id || index}>
                      <td>
                        <strong>{activity.name || activity.title || 'Activity'}</strong>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {activity.activity_type || activity.type || 'N/A'}
                        </span>
                      </td>
                      <td>{activity.duration || 'N/A'} min</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {activity.calories_burned || activity.calories || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>{activity.user ? (activity.user.username || activity.user) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <small className="text-muted">
          Total activities: {activities.length}
        </small>
      </div>
    </div>
  );
};

export default Activities;