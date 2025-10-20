import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const API_ENDPOINT = `${API_BASE_URL}/leaderboard/`;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log('Fetching leaderboard from:', API_ENDPOINT);
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
        console.log('Leaderboard API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard data:', leaderboardData);
        
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [API_ENDPOINT]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading leaderboard</h4>
          <p>{error}</p>
          <p><strong>API Endpoint:</strong> {API_ENDPOINT}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      <p className="text-muted">API Endpoint: {API_ENDPOINT}</p>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info">
          <p>No leaderboard data found.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Team</th>
                    <th scope="col">Total Points</th>
                    <th scope="col">Activities</th>
                    <th scope="col">Calories Burned</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id || entry.user_id || index}>
                      <th scope="row">
                        {index === 0 && <span className="badge bg-warning text-dark">🏆</span>}
                        {index === 1 && <span className="badge bg-secondary">🥈</span>}
                        {index === 2 && <span className="badge bg-warning">🥉</span>}
                        {index + 1}
                      </th>
                      <td>
                        <strong>{entry.user?.username || entry.username || entry.name || 'Unknown User'}</strong>
                      </td>
                      <td>{entry.team?.name || entry.team_name || entry.team || 'No Team'}</td>
                      <td>
                        <span className="badge bg-primary fs-6">
                          {entry.total_points || entry.points || entry.score || 0}
                        </span>
                      </td>
                      <td>{entry.total_activities || entry.activities_count || entry.activities || 0}</td>
                      <td>{entry.total_calories || entry.calories_burned || entry.calories || 0}</td>
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
          Total entries: {leaderboard.length}
        </small>
      </div>
    </div>
  );
};

export default Leaderboard;